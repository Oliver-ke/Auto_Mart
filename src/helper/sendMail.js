import sgMail from '@sendgrid/mail';

export default async (msgContent) => {
  sgMail.setApiKey(process.env.EMAIL_API_KEY);
  const msg = {
    to: msgContent.email,
    from: 'automart-care@auto-mart-ng.com',
    subject: 'Forget password',
    text: 'Check the email to view your password',
    html: `<div>
    <h3>You have requested to reset your password on Auto Mart </h3>
    <p>Your new password is <span>
    <h1>${msgContent.newUserPassword}</h1>
    </span></p>
    <small>Please ensure you change your password after login </small>
    </div>`,
  };
  try {
    const res = await sgMail.send(msg);
    return { error: null, result: res };
  } catch (error) {
    return { error: error.message, result: null };
  }
};
