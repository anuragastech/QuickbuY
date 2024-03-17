const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '5m' } // OTP expires after 5 minutes
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;
