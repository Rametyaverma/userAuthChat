const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send verification email for registration
const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div>
        <h2>Email Verification</h2>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send OTP for Reset Password
const sendResetOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div>
        <h2>Reset Password OTP</h2>
        <p>Your password reset code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset OTP email sent to:', email);
  } catch (error) {
    console.error('Error sending reset OTP email:', error);
    throw new Error('Failed to send reset OTP email');
  }
};

module.exports = { sendVerificationEmail, sendResetOtpEmail };
