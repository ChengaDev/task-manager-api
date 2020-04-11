const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'gazit.chen@gmail.com',
    subject: 'Thanks for joining TaskApp!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancelAccountEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'gazit.chen@gmail.com',
    subject: 'So sad you are leaving TaskApp...',
    text: `Hi, ${name}. Why are you leaving us? tell us what went wrong...`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelAccountEmail,
};
