const cloudinary = require("../../models/common/cloudinary");
const Homepagepic=require('../../models/admin/Homepagebar')
const multer = require("../../models/common/multerconfig");
const upload = multer.single("image");


let HomepagepicPost = async (req, res) => {
    try {
      const { h1, h2  } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
  
      const desiredWidth = 1100;
      const desiredHeight = 1200;
  
      const result = await cloudinary.uploader.upload(req.file.path, {
        width: desiredWidth,
        height: desiredHeight,
        crop: 'scale' 
    });
  
      const newHomepagepic = new Homepagepic({
        h1: h1,
        h2: h2,
        image: {
            public_id: result.public_id,
            url: result.secure_url
        },
      //   image1: {
      //     public_id: result.public_id,
      //     url: result.secure_url
      // },
  
      });
  
      const savedHomepagepic = await newHomepagepic.save();
  
      res.status(201).json(savedHomepagepic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


   let HomepagepicGet=async (req, res) => {
  
    try {
    //   const Homepagepic = await Homepagepic.find();
      res.render(  'admin/HomepageControl');
    } catch (error) {
      console.error("Error fetching Homepagepic:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  module.exports={ HomepagepicPost ,HomepagepicGet} ;