const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true 
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
