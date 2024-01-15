
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    
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
 userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'registers'
 },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
});

const subcategory = mongoose.model('subcategory', subcategorySchema);

module.exports = subcategory;
