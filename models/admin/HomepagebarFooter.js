const mongoose = require("mongoose");

const HomepageFooterSchema = mongoose.Schema({
  h1: {
    type: String,
    required: true,
  },
  h2: {
    type: String,
    required: true,
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
description:{
  type:String,
  required:true,
},
// image1:{
//   public_id:{
//    type:String,
//    required:true,
//   },
//   url:{
//    type:String,
//    required:true,
//   }
// },
});

module.exports = mongoose.model("HomepageFooter", HomepageFooterSchema);
