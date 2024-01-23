const mongoose = require('mongoose');

const createSchema = mongoose.Schema({
  productname: {
    type: String,
    required: true,
  },
  manufacturename: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: [String],
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'registers',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category', // Make sure it matches the model name
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subcategory', // Make sure it matches the model name
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: [String],
    required: true,
  },
  Quantity: {
    type: [Number],
    required: true,
  },
});

module.exports = mongoose.model('product', createSchema);
