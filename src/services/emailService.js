// services/emailService.js

const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../utils/sesClient");

const sendEmail = async ({
  toAddress,
  fromAddress,
  subject,
  htmlBody,
  textBody,
}) => {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });

  return sesClient.send(command);
};

module.exports = {
  sendEmail,
};
