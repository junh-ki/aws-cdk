# aws-cdk

## IAM Setup

The new workflow to setup IAM involves with IAM Identity Center
The initial IAM setup instructions:

1. IAM Identity Center > Users > Add user ("cdk-developer")
2. IAM Identity Center > Groups > Create group ("Developers")
3. Then add users to the group
4. IAM Identity Center > Multi-account permissions > AWS accounts
   - Click your management account
   - Assign users and groups
   - Assign permission sets (Name it CdkDeveloperAccess with a custom permission set - AdministratorAccess for now)

## AWS CLI Setup

1. Install AWS CLI
2. Open the terminal and run: `aws configure sso`
3. Configure as follow:
`SSO session name (Recommended): cdk-developer`
`SSO start URL [None]: ... # Get it from: IAM Identity Center > Dashboard > Settings summary > AWS access portal URL`
`SSO region [None]: eu-central-1`
`SSO registration scopes [sso:account:access]: # Leave it blank`
4. The above steps will trigger OIDC login. For that you should download Google Authenticator and follow the instructions from AWS such that you should use MFA if you want to login with the cdk-developer credential on the AWS access portal next time.
5. Then comback to your terminal and set the account ID (will be set automatically if there is only one account), role (CdkDeveloperAccess), client region (eu-central-1), and finally name your profile: `cdk-developer-junhki`
6. Verify that everything is set up by checking your assumed identity:
`aws sts get-caller-identity --profile cdk-developer-junhki`
`aws s3 ls --profile cdk-developer-junhki`
7. Now that you set things up, go to the AWS access portal and login for the cdk-developer account with MFA. Once done, click the main account shown and then click CdkDeveloperAccess to see the main AWS console page.

## Leapp Secrets Manager

As a personal password manager, but for your AWS credentials. Leapp makes it easy to manage all of your keys and rotate them as needed.

## For MacOS

1. `brew update`
2. `brew upgrade`
3. `brew install awscli`
   `aws --version`
4. `brew install node`
   `node -v`
   `npm -v`
5. `npm install -g aws-cdk`
   `cdk --version`
6. `npm install aws-cdk-lib`
7. `npm init` - To create a package.json file in the directory. This file defines your project and its dependencies
8. `npm install @aws-sdk/client-s3`

And make sure to install the AWS Toolkit extension on your VSCode.

## CDK Concepts

1. App: The root of your CDK application (your whole project)
2. Stack: A unit of deployment in CDK, representing a CloudFormation stack
3. Construct: The basic building block of CDK apps, a class that represents one or more AWS resources
(e.g., `bucket = s3.Bucket(self, 'MyBucket')`)
   - L1: Low level, direct CloudFormation resources
   - L2: High level, pre-built abstractions (e.g., aws_s3.Bucket)
   - L3: Opinionated combinations of resources (e.g., aws_apigateway.LambdaRestApi)
4. Context: key-value paris you can pass into the apps at runtime, configuration values to control how your app behaves (dev/test/prod)

## CDK Commands

1. `cdk init app --language typescript` - To initialize your CDK application using the TypeScript boilerplate
2. `cdk bootstrap --profile cdk-developer-junhki` - To bootstrap your CDK application (needed only once)
3. `cdk synth --profile cdk-developer-junhki` - To synthesize your CDK application (the resulting CloudFormation templates are written to the cdk.out directory)
4. `cdk deploy --profile cdk-developer-junhki` - To deploy the resources defined in the CDK app
5. `cdk list --profile cdk-developer-junhki` - To list all the stacks deployed by the CDK app in your AWS account
6. `cdk context --profile cdk-developer-junhki` - To set context values for your CDK app, which can be used to configure app-specific settings
7. `cdk doctor --profile cdk-developer-junhki` - To check your CDK app for common issues and provides recommendations on how to fix them

## CDK Application Workflow

1. `npm install`
2. `npm run build`
3. `cdk synth --profile cdk-developer-junhki -c adminEmailAddress=kijoonh91@gmail.com`
4. `cdk deploy --all --profile cdk-developer-junhki -c adminEmailAddress=kijoonh91@gmail.com`

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
