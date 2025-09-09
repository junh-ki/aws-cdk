import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda, aws_s3 as s3, aws_s3_notifications as s3n } from 'aws-cdk-lib';
import * as path from 'path';

export class HelloCdkStack extends cdk.Stack {

  /**
   * Constructor for the stack
   * @param {cdk.App} scope - The CDK application scope
   * @param {string} id - Stack ID
   * @param {cdk.StackProps} props - Optional stack properties
   */
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloCdkS3Bucket = new s3.Bucket(this, 'HelloCdkS3Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(1),
        },
      ],
    });

    const helloCdkLambdaFunction = new lambda.Function(this, 'HelloCdkLambda', {
      description:
        `Lambda function generates
        a dynamic greeting by retrieving the text from an
        S3 object and when triggered by S3 events`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.main',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../lambda/lambda-hello-cdk')
      ),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    helloCdkS3Bucket.grantRead(helloCdkLambdaFunction);

    helloCdkS3Bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(helloCdkLambdaFunction),
      { suffix: '.txt' }
    );

    new cdk.CfnOutput(this, 'bucketName', {
      value: helloCdkS3Bucket.bucketName,
      description: 'Name of the S3 bucket for uploading greetings',
    });
  }
}
