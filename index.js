import SES from "aws-sdk/clients/ses";
import parse from "parse-email";

const ses = new SES({ region: process.env.REGION || "us-east-1" });

const send = async ({ to, from, email }) => {
  const params = {
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
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
    Source: from,
    ReplyToAddresses: [email.from.value[0].address || email.from.text],
  };

  return ses.sendEmail(params).promise();
};

export const handler = async (event) => {
  const { Message } = event.Records[0].Sns;
  const msg = JSON.parse(Message);
  console.log("Message:", JSON.stringify(msg));

  let email = null;
  try {
    email = await parse(msg.content);
  } catch (error) {
    console.log("Message:", JSON.stringify(error));
    return;
  }

  const proms = [];
  const { DESTINATION, FROM } = process.env;
  const destination = JSON.parse(DESTINATION);
  email.to.value.forEach((e) => {
    const to = destination[e.address] || destination["default"];
    const prom = send({ to, from: e.address || FROM, email });
    proms.push(prom);
  });

  await Promise.all(proms);
};
