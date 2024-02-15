const mongoose = require("mongoose");

const  checkoutSchema = mongoose.Schema({
     product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'product',
        required: true,
        // unique: true
    },
   
   
    size:{
        type:String,
        required:true,
     },
     quantity:{
        type:String,
        required:true,
     },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registers',
        required: true
    }, 
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupen' // Note: You might want to rename 'coupen' to 'coupon' for consistency
    },
    appliedCouponCode: {
        type: String // Store the coupon code that was applied
    },
    discountedAmount: {
        type: Number // Store the discounted amount if applicable
    },
});



module.exports = mongoose.model("Checkout", checkoutSchema);
