const mongoose = require("mongoose");

const userprofileSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
},
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'registers',
  },
  image:{
    public_id:{
     type:String,
     required:true,
    },
    url:{
     type:String,
     required:true,
    }
},

});

module.exports = mongoose.model("userprofile", userprofileSchema);
