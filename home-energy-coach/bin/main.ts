#!/usr/bin/env node
import 'source-map-support/register'; // To get JavaScript stack traces from TypeScript errors
import * as cdk from 'aws-cdk-lib';
import { HelloCdkStack } from '../lib/stacks/stack-data-pipeline';

const app = new cdk.App();
new HelloCdkStack(app, 'HelloCdkStack', {

  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});
