const sgMail = require('@sendgrid/mail');

const sendEmail = (name, email, message) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'eitan1112@gmail.com',
    from: 'noreply@subdab.com',
    subject: 'New Response On Subdab',
    text: `
    New message from ${name}.
    His email address is ${email}.
    Message:
    ${message}
    `
  };
  sgMail.send(msg);
}

export {sendEmail}