import * as dotenv from "dotenv";
dotenv.config();

import { readFileSync } from "fs";
import { execSync } from "child_process";

import * as uuidv1 from "uuid/v1";
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

function base64_encode(file: string) {
  var bitmap = readFileSync(file);
  return new Buffer(bitmap).toString("base64");
}

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
  // 2. Capture image async
  const fileName = `${uuidv1()}.jpg`;

  execSync(`raspistill -w 640 -h 480 -sa -100 -rot 270 -o ${fileName}`);

  const body = {
    sendTo: message.sendTo,
    base64Image: base64_encode(fileName),
    fileName
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY
    },
    body: JSON.stringify(body)
  })
    .then(res => {
      console.log(res.ok);
    })
    .catch(e => console.log(e));
});
