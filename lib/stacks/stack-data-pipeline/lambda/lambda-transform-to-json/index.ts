import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { Readable } from 'stream';
import csv from 'csvtojson';

const client = new S3Client({ region: process.env.AWS_REGION });
const DESTINATION_BUCKET = process.env.jsonTransformedBucket;

/**
 * Lambda function invoked on S3 object created event
 */
export const main = async (event: S3Event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  console.log(
    `Event passed to Lambda including:\n Bucket: ${bucket} Key: ${key}`
  );

  const input = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(input);
    const response = await client.send(command);

    if (!response.Body) {
      throw new Error("S3 object body is undefined.");
    }

    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const fileContents = Buffer.concat(chunks).toString('utf8');

    // Convert CSV to JSON
    const jsonArray = await csv().fromString(fileContents);

    // Upload JSON data to the destination bucket
    const putCommand = new PutObjectCommand({
      Bucket: DESTINATION_BUCKET,
      Key: key.replace('.csv', '.json'), // Assume the key had a .csv extension
      Body: JSON.stringify(jsonArray),
      ContentType: 'application/json',
    });

    await client.send(putCommand);

    console.log(
      `File transformed and uploaded to: ${DESTINATION_BUCKET}/${key.replace('.csv', '.json')}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'CSV successfully transformed to JSON and uploaded to the destination bucket.',
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing the operation.',
      }),
    };
  }
};
