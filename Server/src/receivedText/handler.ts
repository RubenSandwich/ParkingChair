import { fromCallback } from "promise-cb";
import { IotData } from "aws-sdk";

import { ICallback, IEventPayload, HTTPStatusCodes } from "../lambdaTypes";

declare const process: {
  env: {
    awsIOTTopicSend: string;
    awsIOTEndPoint: string;
  };
};

const iotdata = new IotData({ endpoint: process.env.awsIOTEndPoint });
const iotdataPublishPromise = (params): Promise<any> =>
  fromCallback(cb => iotdata.publish(params, cb));

export const receivedText = async (event, context, cb) => {
  const { awsIOTTopicSend } = process.env;
  const addMessage = `${awsIOTTopicSend}`;
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `receivedText executed successfully! ${addMessage}`,
      input: event
    })
  };

  try {
    var params = {
      topic: process.env.awsIOTTopicSend,
      payload: event.body
    };

    await iotdataPublishPromise(params);

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
