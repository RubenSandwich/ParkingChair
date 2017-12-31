import * as twilio from "twilio";

import { fromCallback } from "promise-cb";

import { HTTPStatusCodes } from "../lambdaTypes";

declare const process: {
  env: {
    twilioNumber: string;
    twilioAuthToken: string;
    twilioAccSID: string;
  };
};

const { twilioAuthToken, twilioAccSID } = process.env;
const twilioClient = new twilio(twilioAccSID, twilioAuthToken);

const sendTextPromise = (params): Promise<any> =>
  fromCallback(cb => twilioClient.messages.create(params, cb));

export const sendText = async (event, _, cb) => {
  const { twilioNumber } = process.env;

  try {
    const body = JSON.parse(event.body);

    // TODO:
    // 1. Upload sent base64 image to S3
    // 2. Get URL of uploaded image
    // 3. Include URL in sent message

    var params = {
      body: "Hello from Node",
      to: body.sendTo,
      from: twilioNumber
    };

    await sendTextPromise(params);

    const response = {
      statusCode: 200,
      body: JSON.stringify(body)
    };

    cb(null, response);
  } catch (e) {
    console.log(e);

    cb(null, {
      statusCode: HTTPStatusCodes.InternalServerError,
      body: "Server Error. Check server error logs."
    });
  }
};
