const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
     product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'product',
        required: true,
        // unique: true
    },
   
    // category: {
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'category',
    //     required: true
    // },
    // subcategory: {
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'subcategory',
    //     required: true
    // },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registers',
        required: true
    }, 
});

module.exports = mongoose.model("Cart", cartSchema);
