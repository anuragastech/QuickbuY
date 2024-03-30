const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // razorpayOrderId: {
  //   type: String,
  //   // required: true
  // },


  
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product', 
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
      type:String,
   },
   quantity:{
      type:String,
   },
   price:{
    type:Number,
 },
 color:{
  type:String,
},
productname:{
  type:String,
},
brand:{
  type:String,
},
category:{
  type:String,
},
subcategory:{
  type:String,
},
address:{
  type:Object,
  required: true
},



paymentMethod: {
  type: String,

},
venderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'vender',
  // required: true
},
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user',
  // required: true
},


  
  

shippingStatus: {
  type: String,
  default: 'processing' ,

},
paymentStatus: {
  type: String,
  default: 'Success' ,
},
  orderAccepted: {
    type: String,
    default: 'pending' ,
},
  
});

module.exports = mongoose.model('Order', orderSchema);
