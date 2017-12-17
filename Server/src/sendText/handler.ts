declare const process: {
  env: {
    twilioNumber: string;
    twilioAuthToken: string;
    twilioAccSID: string;
  };
};

export const sendText = (event, context, cb) => {
  const { twilioNumber, twilioAuthToken, twilioAccSID } = process.env;

  const addMessage = `${twilioNumber} ${twilioAuthToken} ${twilioAccSID}`;
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `sendText executed successfully! ${addMessage}`,
      input: event
    })
  };

  cb(null, response);
};
