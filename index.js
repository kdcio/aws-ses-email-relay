const AWS = require("aws-sdk");
const parse = require("parse-email");

const ses = new AWS.SES({ region: process.env.REGION || "us-east-1" });

const handler = async (event) => {
  const { Message } = event.Records[0].Sns;
  const msg = JSON.parse(Message);
  console.log("Message:", JSON.stringify(msg, null, 2));

  let email = null;
  try {
    email = await parse(msg.content);
  } catch (error) {
    console.log("Message:", JSON.stringify(error, null, 2));
    return;
  }

  const params = {
    Destination: {
      ToAddresses: [process.env.DESTINATION],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: email.html,
        },
        Text: {
          Charset: "UTF-8",
          Data: email.text,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: email.subject,
      },
    },
    Source: email.to.value[0].address || process.env.FROM,
    ReplyToAddresses: [email.from.value[0].address || email.from.text],
  };

  return ses.sendEmail(params).promise();
};

module.exports = { handler };
