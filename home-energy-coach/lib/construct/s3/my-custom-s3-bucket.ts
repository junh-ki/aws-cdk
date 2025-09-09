import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

/**
 * Properties for the MyCustomS3Bucket construct
 */
export interface MyCustomS3BucketProps {

  /**
   * The physical name of the S3 bucket.
   */
  bucketName: string;

  /**
   * Number of days after which objects expire.
   * 
   * @default 90
   */
  expirationDays?: number;
}

/**
 * A custom L3 construct that creates an S3 bucket with specific configurations.
 */
export class MyCustomS3Bucket extends Construct {
  
  /**
   * The main S3 bucket created by this construct.
   */
  public readonly bucket: s3.Bucket;

  /**
   * The associated access logs bucket.
   */
  public readonly accessLogsBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: MyCustomS3BucketProps) {
    super(scope, id);

    // Create the access logs bucket
    this.accessLogsBucket = new s3.Bucket(this, 'AccessLogsBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
    });

    // Create the main S3 bucket with lifecycle rules and access logs configured
    this.bucket = new s3.Bucket(this, 'CustomBucket', {
      bucketName: props.bucketName,
      encryption: s3.BucketEncryption.S3_MANAGED,
      serverAccessLogsBucket: this.accessLogsBucket,
      versioned: true,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(props.expirationDays ?? 90),
          transitions: [
            {
              storageClass: s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: cdk.Duration.days(30),
            }
          ],
        },
      ],
    });
  }
}
