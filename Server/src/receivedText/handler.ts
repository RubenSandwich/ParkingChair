declare const process: {
  env: {
    awsIOTTopicSend: string;
  };
};

export const receivedText = (event, context, cb) => {
  const { awsIOTTopicSend } = process.env;
  const addMessage = `${awsIOTTopicSend}`;
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `receivedText executed successfully! ${addMessage}`,
      input: event
    })
  };

  cb(null, response);
};
