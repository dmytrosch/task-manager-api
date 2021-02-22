const nodemailer = require("nodemailer");

async function sendEmailVerification(recipient, verificationToken) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: recipient,
    subject: "Email verification",
    html: `<div>
    <h2>Please verify your email!</h2>
    <a href='http://${process.env.BASE_URL}/api/auth/verify/${verificationToken}'>Click to verify</a>
    </div>`,
  });
}

module.exports = sendEmailVerification;
