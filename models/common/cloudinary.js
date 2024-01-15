
const cloudinary=require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();


dotenv.config();

cloudinary.config({
  cloud_name: 'dd6qdgpfr',
  api_key: '398647298121187',
  api_secret: '-yirqKcuJjY1BsCtvT0IE_LF6Co',
  api_base: 'http://api.cloudinary.com/v1_1' 
});

 
module.exports = cloudinary;