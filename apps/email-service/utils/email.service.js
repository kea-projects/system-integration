import sgMail from "@sendgrid/mail";
import "dotenv/config";

export const sendInviteEmail = (invitee, invited) => {
  // Send the actual email
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: invited,
    from: process.env.SENDGRID_FROM_DOMAIN,
    subject: `You've got mail!`,
    html: `<string>${invitee} wants to be your friend!</strong>`,
  };
  // TODO - add a link? idk

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
    })
    .catch((error) => {
      console.error(error);
      console.error(error.response.body);
    });
};
