import * as cdk from 'aws-cdk-lib';
import { CfnBucket } from 'aws-cdk-lib/aws-s3';
import * as path from 'path';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rawDataBucket = new CfnBucket(this, 'rawDataBucket', {
      bucketName: 'raw-data-landing-zone-greeting-l1',
      accessControl: 'Private'
    });
  }
}
