import * as twilio from "twilio";
import { S3 } from "aws-sdk";

import { fromCallback } from "promise-cb";

import { HTTPStatusCodes } from "../lambdaTypes";

declare const process: {
  env: {
    twilioNumber: string;
    twilioAuthToken: string;
    twilioAccSID: string;
    imagesBucketName: string;
  };
};

const { twilioAuthToken, twilioAccSID } = process.env;
const twilioClient = new twilio(twilioAccSID, twilioAuthToken);

const sendTextPromise = (params): Promise<any> =>
  fromCallback(cb => twilioClient.messages.create(params, cb));

const s3Bucket = new S3({ params: { Bucket: process.env.imagesBucketName } });
const uploadToS3Promise = (params): Promise<any> =>
  fromCallback(cb => s3Bucket.upload(params, cb));

export const sendText = async (event, _, cb) => {
  const { twilioNumber } = process.env;

  try {
    const body = JSON.parse(event.body);
    const { base64Image, fileName, sendTo } = body;

    const buf = new Buffer(base64Image, "base64");

    const data = {
      Key: fileName,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/jpeg"
    };

    const s3Responce = await uploadToS3Promise(data);

    var params = {
      body: "",
      mediaUrl: s3Responce.Location,
      to: sendTo,
      from: twilioNumber
    };

    await sendTextPromise(params);

    cb(null, {
      statusCode: HTTPStatusCodes.OK
    });
  } catch (e) {
    console.log(e);

    cb(null, {
      statusCode: HTTPStatusCodes.InternalServerError,
      body: "Server Error. Check server error logs."
    });
  }
};
