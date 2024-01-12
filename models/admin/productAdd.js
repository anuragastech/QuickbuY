const mongoose=require('mongoose')



const createSchema = mongoose.Schema({
    productname: {
     type: String,
     required: true
   },
   manufacturename: {
     type: String,
     required: true
   },
   brand: {
     type: String,
     required: true
   },
   price: {
    type: String,
    required: true
  },
  description: {
    type: [String],
    required: true
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

 
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subcategory',
    required: true,

  },

  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'color',
    required: true,

  },

  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'size',
    required: true,

  },
  Quantity: {
    type: Number,
    default: 0,
},
  });
  
  module.exports = mongoose.model("product", createSchema);
  