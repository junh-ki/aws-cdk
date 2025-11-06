import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_sns as sns } from 'aws-cdk-lib';
import { aws_sns_subscriptions as subscriptions } from 'aws-cdk-lib';

export interface SharedResourcesStackProps extends cdk.StackProps {
  readonly adminEmailAddress: string;
}

/**
 * The stack class extends the base CDK Stack
 */
export class SharedResourcesStack extends cdk.Stack {
  
  // These are the properties that will be made available to other stacks
  public readonly rawDataUploadBucket: s3.Bucket;
  public readonly snsTopicRawUpload: sns.Topic;
  public readonly snsTopicCalculatorSummary: sns.Topic;

  /**
   * Constructor for the stack
   * @param {cdk.App} scope - The CDK application scope
   * @param {string} id - Stack ID
   * @param {SharedResourcesStackProps} props - Stack properties including adminEmailAddress 
   */
  constructor(scope: cdk.App, id: string, props: SharedResourcesStackProps) {
    // Call super constructor
    super(scope, id, props);

    // Create raw landing bucket for S3
    this.rawDataUploadBucket = new s3.Bucket(this, 'RawDataUploadBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(1),
        },
      ],
    });

    // Create SNS Notification topic for raw data upload
    this.snsTopicRawUpload = new sns.Topic(this, 'SnsTopicRawUpload', {
      displayName: 'Home Energy Coach SNS Topic',
    });

    // Add email subscription to SNS topic for raw upload
    this.snsTopicRawUpload.addSubscription(
      new subscriptions.EmailSubscription(props.adminEmailAddress)
    );

    // Create SNS Notification topic for calculator summary
    this.snsTopicCalculatorSummary = new sns.Topic(
      this,
      "SnsTopicCalculatorSummary",
      {
        displayName: "Home Energy Coach SNS Topic for calculator summary",
      }
    );

    // Add email subscription to SNS topic for calculator summary
    this.snsTopicCalculatorSummary.addSubscription(
      new subscriptions.EmailSubscription(props.adminEmailAddress)
    );
  }
}
