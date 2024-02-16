const mongoose = require("mongoose");

const categorySchema= mongoose.Schema({
   title:{
      type:String,
      required:true,
   },
   description:{
      type:String,
      required:true,
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
   venderId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'vender'
   },

})

module.exports=mongoose.model("category",categorySchema);
