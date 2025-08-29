import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import * as path from 'path';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloCdkLambda = new lambda.Function(
      this, 'HelloCdkLambda', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.main',
        code: lambda.Code.fromAsset(
          path.join(__dirname, './lambda/lambda-hello-cdk')
        ),
      });
  }
}
