import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda, aws_s3 as s3 } from 'aws-cdk-lib';
import { Bucket, BucketEncryption, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Level 1 (L1) construct for S3 Bucket
    const rawDataBucketL1 = new CfnBucket(this, 'rawDataBucket', {
      bucketName: 'raw-data-landing-zone-greeting-l1',
      accessControl: 'Private'
    });

    // Level 2 (L2) construct for S3 Bucket
    const rawDataBucketL2 = new Bucket(this, 'MyS3Bucket', {
      bucketName: 'raw-data-landing-zone-greeting-l2',
      encryption: BucketEncryption.KMS,
      versioned: true,
    });

    const helloCdkLambda = new NodejsFunction(this, 'HelloCdkLambda', {
      entry: path.join(__dirname, './lambda/lambda-hello-cdk/index.ts'),
      handler: 'main', // function name you exported
      runtime: lambda.Runtime.NODEJS_22_X,
    });

    const helloBucket = new s3.Bucket(this, 'HelloCdkS3Bucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    helloBucket.grantReadWrite(helloCdkLambda)
  }
}
