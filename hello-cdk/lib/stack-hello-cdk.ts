import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new NodejsFunction(this, 'HelloCdkLambda', {
      entry: path.join(__dirname, './lambda/lambda-hello-cdk/index.ts'),
      handler: 'main', // function name you exported
      runtime: lambda.Runtime.NODEJS_22_X,
    });
  }
}
