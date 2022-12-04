const { SendEmailCommand } = require("@aws-sdk/client-ses");

const createSendEmailCommand = (toAddress, fromAddress, shortCode="") => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      ToAddresses: [
        toAddress, //MUST BE A VERIFIED EMAIL
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
                <h1>Reset password Link</h1>
                <p>Use this code to reset your password</p>
                <h3 style="color:red">${shortCode}</h3>
                <i>www.udemy-clone.com</i>
            </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password reset Code!",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
        fromAddress
    ],
  });
};

module.exports = { createSendEmailCommand };
