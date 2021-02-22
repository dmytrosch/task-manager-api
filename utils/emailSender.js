const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

async function sendEmailVerification(recipient, verificationToken) {
  try {
    await transport.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: recipient,
      subject: "Email verification",
      html: `<div>
    <h2>Please verify your email!</h2>
    <a href='${process.env.BASE_URL}/verify/${verificationToken}'>Click to verify</a>
    </div>`,
    });
  } catch (err) {
    console.log(err);
  }
}
async function sendResetPasswordLink(recipient, resetToken) {
  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: recipient,
    subject: "Reset password",
    html: `<div>
    <h2>Change your password!</h2>
    <a href='${process.env.BASE_URL}/reset-password/${resetToken}'>Click to reset password!</a>
    </div>`,
  });
}

module.exports = { sendEmailVerification, sendResetPasswordLink };
