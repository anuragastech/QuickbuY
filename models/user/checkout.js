const mongoose = require("mongoose");

const  checkoutSchema = mongoose.Schema({

    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'product',
                // required: true
            },
           productname: {
                type: String,
                // required: true
            },
            size: {
                type: String,
                // required: true
            },
            quantity: {
                type: String,
                // required: true
            },
          
            vednerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'vender',
                // required: true
            },
        }
    ],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }, 
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupen' 
    },
    appliedCouponCode: {
        type: String 
    },
    discountedAmount: {
        type: Number 
    },
});



module.exports = mongoose.model("Checkout", checkoutSchema);
