import * as querystring from "querystring";

import { fromCallback } from "promise-cb";
import { IotData } from "aws-sdk";

import { HTTPStatusCodes } from "../lambdaTypes";

declare const process: {
  env: {
    awsIOTTopicSend: string;
    awsIOTEndPoint: string;
  };
};

const iotdata = new IotData({ endpoint: process.env.awsIOTEndPoint });
const iotdataPublishPromise = (params): Promise<any> =>
  fromCallback(cb => iotdata.publish(params, cb));

export const receivedText = async (event, _, cb) => {
  const { awsIOTTopicSend } = process.env;
  const message = querystring.parse(event.body);

  try {
    const payload = { sendTo: message.From };

    var params = {
      topic: awsIOTTopicSend,
      payload: JSON.stringify(payload)
    };

    await iotdataPublishPromise(params);

    cb(null, {
      statusCode: HTTPStatusCodes.OK,
      headers: {
        "Content-Type": "text/html"
      }
    });
  } catch (e) {
    console.log(e);

    cb(null, {
      statusCode: HTTPStatusCodes.InternalServerError,
      headers: {
        "Content-Type": "text/html"
      },
      body: "Server Error. Check server error logs."
    });
  }
};
