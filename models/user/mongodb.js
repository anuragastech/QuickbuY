const mongoose = require('mongoose');

const createSchema = mongoose.Schema({
    name: {
        type: String,
        
    },
    email: {
        type: String,
        
    },
    password: {
        type: String,
        
    },
    role: {
        type: String,
        
    },
    blocked: {
        type: Boolean,
        default: false // Default value is false, indicating the user is not blocked
    },

    personalInfo: [{
        address: { type: String, },
        number: { type: Number, },
        country: { type: String, },
        state: { type: String, },

        city: { type: String, },

        pincode: { type: Number, },
    }],

profileData :[{
    fullname:{
        type:String,
    },
    phoneNumber:{
        type:Number,
    },
    Website:{

    },
    Twittwer:{

    },
    Github:{
    },
    Instegram:{

    },
    facebook:{

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

}]


});

module.exports = mongoose.model('user' , createSchema);
