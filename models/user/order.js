const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // razorpayOrderId: {
  //   type: String,
  //   // required: true
  // },


  
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', 
      // required: true
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    totalAmount: {
      type: Number,
      // required: true
    },
    size:{
      // type:String,
   },
   quantity:{
      // type:String,
   },
  
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed']
  },
  shippingStatus: {
    type: String,
    enum: ['pending', 'shipped', 'delivered']
  }
});

module.exports = mongoose.model('Order', orderSchema);
