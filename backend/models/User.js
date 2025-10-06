const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  dob: {
    type: Date,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  unverifiedExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 1 * 60 * 1000) // 1 min
  },
  resetVerified: {   // 👈 NEW FIELD
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.resetPassword = async function (newPassword) {
  this.password = newPassword; // pre-save hook will hash
  this.resetVerified = false;
  this.otp = undefined;
  this.otpExpiry = undefined;
  await this.save();
};


// Mark user as verified
UserSchema.methods.markVerified = async function () {
  this.isVerified = true;
  this.otp = undefined;
  this.otpExpiry = undefined;
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);
