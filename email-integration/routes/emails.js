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
  res.send({
    message: "Sending an invite email based on a template",
  });
});

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

  // Process the email
  res.send({
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
