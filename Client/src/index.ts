import * as dotenv from "dotenv";
dotenv.config();

declare const process: {
  env: {
    API_KEY: string;
  };
};

import fetch from "node-fetch";

const url =
  "https://m3hk0nej61.execute-api.us-east-1.amazonaws.com/dev/sendText";

fetch(url, {
  method: "POST",
  headers: {
    "X-Api-Key": process.env.API_KEY
  }
})
  .then(res => res.json())
  .then(json => console.log(json));
