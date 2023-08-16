
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'ujjwalsingharcsinfotech@gmail.com', 
    pass: 'cepsdvcphqnhbcce', 
  },
});

async function sendPasswordResetEmail(email, token) {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  const mailOptions = {
    from: 'ujjwalsingharcsinfotech@gmail.com', 
    to: email,
    subject: 'Password Reset Request',
    text: ` 
    hey you have successfully generated the password reset link and passoword reset link is below
      ${resetLink}
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send password reset email to ${email}: ${error}`);
    throw error; 
  }
}

module.exports = sendPasswordResetEmail;
