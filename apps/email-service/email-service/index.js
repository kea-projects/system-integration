const sgMail = require("@sendgrid/mail");

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  context.log("body", req.body);

  const invitee = req.body.invitee;
  const invited = req.body.invited;
  const token = req.body.token;
  if (!invitee) {
    context.res = {
      status: 400,
      body: { message: "The message body is missing an invitee property" },
    };
    return;
  }
  if (!invited) {
    context.res = {
      status: 400,
      body: { message: "The message body is missing an invited property" },
    };
    return;
  }
  if (!token) {
    context.res = {
      status: 400,
      body: { message: "The message body is missing a token property" },
    };
    return;
  }
  const responseMessage = process.env["SENDGRID_FROM_DOMAIN"];

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: invited,
    from: process.env.SENDGRID_FROM_DOMAIN,
    subject: `You've got mail!`,
    html: `<strong>${invitee} wants to be your friend!</strong><br/>Use this token to accept:<br/><i>${token}</i>`,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
    })
    .catch((error) => {
      console.error(error);
      console.error(error.response.body);
    });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: { message: "Email sent" },
  };
};
