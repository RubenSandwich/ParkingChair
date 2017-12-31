import * as dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import * as awsIot from "aws-iot-device-sdk";

declare const process: {
  env: {
    API_URL: string;
    API_KEY: string;
    AWS_IOT_TOPIC: string;
    AWS_IOT_ENDPOINT: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET_KEY: string;
  };
};

const {
  API_URL,
  API_KEY,
  AWS_IOT_TOPIC,
  AWS_IOT_ENDPOINT,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY
} = process.env;

const client = new awsIot.device({
  protocol: "wss",
  port: 443,
  host: AWS_IOT_ENDPOINT,
  accessKeyId: AWS_ACCESS_KEY,
  secretKey: AWS_SECRET_KEY
});

client.on("connect", () => {
  client.subscribe(AWS_IOT_TOPIC);
});

client.on("message", (_, payload) => {
  const message = JSON.parse(payload);

  // TODO:
  // 1. Capture image
  // 2. Send image as base64 string

  fetch(API_URL, {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY
    },
    body: JSON.stringify(message)
  })
    .then(res => res.json())
    .then(json => console.log(json));
});

client.on("close", () => {
  console.log("close");
});
