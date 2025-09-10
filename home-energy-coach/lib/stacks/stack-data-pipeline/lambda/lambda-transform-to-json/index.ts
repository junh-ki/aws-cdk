import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { Readable } from "stream"; // Node.js stream

const s3Client = new S3Client();

/**
 * Lambda function invoked on S3 object created event
 */
export const main = async (event: S3Event): Promise<{ statusCode: number; body: string }> => {
  console.log("Lambda function invoked");

  // Get bucket and object key from event
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  // Get object data from S3
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    // Convert stream to string
    const stream = response.Body as Readable;
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const buffer = Buffer.concat(chunks);
    const name = buffer.toString("utf-8").trim();

    console.log(`Name extracted from S3 object: "${name}"`);

    // Print greeting with name
    const msg = `Hello, ${name}! I am your new energy assistant.`;
    console.log(`Greeting: ${msg}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: msg,
      }),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error processing request",
          error: error.message,
        }),
      };
    }
    console.error("Unknown error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unknown error occurred",
      }),
    };
  }
};

module.exports = { main };
