const nodemailer = require("nodemailer");
const validateEmailTemplate = require("./emailTemplates/validateEmailTemplate");
const resetPasswordTemplate = require("./emailTemplates/resetPasswordTemplate");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

async function sendEmailVerification(recipient, verificationToken) {
  const link = `${process.env.BASE_URL}/verify/${verificationToken}`;
  const markup = validateEmailTemplate(link);
  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: recipient,
    subject: "Підтвердіть вашу електронну адресу",
    text: `Для завершення реєстрації підтвердіть електронну адресу. Перейдіть за посиланням - ${link}`,
    html: markup,
  });
}
async function sendResetPasswordLink(recipient, resetToken) {
  const link = `${process.env.BASE_URL}/reset-password/${resetToken}`;
  const markup = resetPasswordTemplate(link);
  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: recipient,
    subject: "Скидання паролю",
    text: `Нам прикро, що ви забули свій пароль. На жаль, ми не можемо відновити його, але можемо допомогти створити новий. Для цього перейдіть за посиланням - ${link}`,
    html: markup,
  });
}

module.exports = { sendEmailVerification, sendResetPasswordLink };
