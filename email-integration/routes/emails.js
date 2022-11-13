import sgMail from "@sendgrid/mail";
import "dotenv/config";
import { Router } from "express";

export const emailsRouter = Router();

emailsRouter.get("/", (req, res) => {
  res.send({
    inviteEmail: "POST /emails/invite/:receipientsEmail",
    customEmail: "POST /emails/custom/:receipientsEmail",
  });
});

emailsRouter.post("/invite/:receipientsEmail", (req, res) => {
  const receiptient = req.params.receipientsEmail;
  // Validate the email
  if (!isEmailValid(receiptient)) {
    res.status(400).send({
      timestamp: new Date().toISOString(),
      status: 400,
      error: "Bad Request",
      message: "Validation failed for the provided email",
      path: "/emails/invite/:receipientsEmail",
    });
  }
  // Process the email
  res.status(202).send({
    message: "Sending an invite email based on a template",
  });
});

// TODO - add ability to pass the title and body
// TODO - write the Readme
emailsRouter.post("/custom/:receipientsEmail", (req, res) => {
  const receiptient = req.params.receipientsEmail;
  // Validate the email
  if (!isEmailValid(receiptient)) {
    res.status(400).send({
      timestamp: new Date().toISOString(),
      status: 400,
      error: "Bad Request",
      message: "Validation failed for the provided email",
      path: "/emails/custom/:receipientsEmail",
    });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: receiptient,
    from: process.env.SENDGRID_FROM_DOMAIN,
    subject: "ALERT! You've been attacked",
    text: "The blackwall netrunners are currently diving into your ICE and trying to break through!",
    html: `<strong>!!! WARNING !!! Malware detected!</strong>
    <br>
    Your computer has been attacked by (3) daemons. Our system detected: (2) attempt(s) to obtain your personal data, (1) attempt(s) to corrupt your neural processor.
    <br>
    <strong>IMMEDIATE ACTION REQUIRED.</strong>
    <br>
    Our quick threat neutralization software can prevent identity theft and implant hijacking. Remember! Hostile netrunners can infiltrate your nervous system and force you to commit terrible crimes such as:
    <br>
    - fraudulent bank transfers
    <br>
    - assault
    <br>
    - theft and/or armed robbery
    <br>
    - suicide
    <br>
    To protect yourself, click the SCAN NOW button. Our sophisticated anti-daemon software will eliminate all threats immediately!
    <br>
    If you do not scan in the next (5) minute(s) (17) second(s), your operating system may suffer irreversible damage. Protect yourself now!`,
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

  // Process the email
  res.status(202).send({
    message: "Sending an email with your custom content",
  });
});

/**
 * Check whether the given email is valid.
 * @param {*} email email to validate
 * @returns a boolean
 */
function isEmailValid(email) {
  // TODO - replace with a better regex or Sendgrid email validation API call
  return /(.+)@(.+){2,}\.(.+){2,}/.test(email);
}
