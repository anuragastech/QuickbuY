const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'product',
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        quantity: {
            type: String,
            required: true,
        },
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registers',
        required: true
    }, 
});

module.exports = mongoose.model("Cart", cartSchema);
