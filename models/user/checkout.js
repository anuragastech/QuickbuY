const mongoose = require("mongoose");

const checkoutSchema = mongoose.Schema({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            productName: {
                type: String,
            },
            size: {
                type: String,
            },
            quantity: {
                type: String,
            },
            vendorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'vendor',
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupon'
    },
    appliedCouponCode: {
        type: String
    },
    discountedAmount: {
        type: Number
    },
});

// Create a unique index on the userId field
checkoutSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Checkout", checkoutSchema);
