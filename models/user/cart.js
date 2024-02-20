const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        size: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number, // Assuming quantity is a number
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'product',
            required: true,
        },
    }]
});

module.exports = mongoose.model("Cart", cartSchema);
