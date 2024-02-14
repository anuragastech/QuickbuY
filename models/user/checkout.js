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
});

module.exports = mongoose.model("Checkout", checkoutSchema);
