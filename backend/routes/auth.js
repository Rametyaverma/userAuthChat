const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/emailService');
const { sendResetOtpEmail } = require('../utils/emailService');


const router = express.Router();

// Check username availability
router.get('/check-username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.params.username.toLowerCase() 
    });
    res.json({ available: !user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check email availability
router.get('/check-email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ 
      email: req.params.email.toLowerCase() 
    });
    res.json({ available: !user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { fullName, username, email, password, dob } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Check age requirement
    const age = calculateAge(new Date(dob));
    if (age < 18) {
      return res.status(400).json({ message: 'Must be 18 or older to register' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = new User({
      fullName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      dob,
      otp,
      otpExpiry,
      unverifiedExpiry: new Date(Date.now() + 1 * 60 * 1000)
    });

    await user.save();

    // Send verification email
    await sendVerificationEmail(email, otp);

    res.status(201).json({ 
      message: 'User registered. Please verify your email.', 
      email 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      otpExpiry: { $gt: Date.now() }
    });
    
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// Helper function to calculate age
function calculateAge(birthday) {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}






router.post('/forgot-password/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate OTP and expiry
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await sendResetOtpEmail(email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending OTP' });
  }
});

// Step 2: Verify reset OTP
router.post('/forgot-password/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      otpExpiry: { $gt: Date.now() }
    });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP verified
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.resetVerified = true;   // 👈 Add this
  await user.save();

    res.json({ message: 'OTP verified' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

// Step 3: Reset password
router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.resetVerified) {   // 👈 Check this
      return res.status(404).json({ message: 'OTP not verified or User not found' });
    }

    // Hash new password
    // const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = newPassword;
    user.resetVerified = false;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.resetPassword(newPassword);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});




// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() } // allow login with email too
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username/email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username/email or password' });
    }

    // Optionally generate JWT token
    // (only if you’re using authentication later)
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const token = jwt.sign(
      { id: user._id , username: user.username, email: user.email, fullName: user.fullName, dob:user.dob},
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );
    res.json({
      message: 'Login successful',
      token,   // uncomment if using JWT
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;