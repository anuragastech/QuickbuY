const mongoose = require("mongoose");

const userprofileSchema = mongoose.Schema({
  vendername: {
    type: String,
    required: true,
  },
  Brandname: {
    type: String,
    required: true,
},
CompanyDetails: {
  type: String,
  required: true,
},
  venderId: {
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

module.exports = mongoose.model("venderprofile", userprofileSchema);
