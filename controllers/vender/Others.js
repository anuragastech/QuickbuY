const cloudinary = require("../../models/common/cloudinary");
const multer = require("../../models/common/multerconfig");
const upload = multer.single("image");


const userprofilepic = require('../../models/vender/userprofile')

  let getHome=(req, res) => {
    res.render("vender/signup");
  };


  let userprofile= async (req, res) => {
    try {
      // const { h1, h2  } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
  
      const desiredWidth = 1080;
      const desiredHeight = 1920;
  
      const result = await cloudinary.uploader.upload(req.file.path, {
        width: desiredWidth,
        height: desiredHeight,
        crop: 'scale' 
    });
  
      const userprofile = new userprofilepic({
        // h1: h1,
        // h2: h2,
        image: {
            public_id: result.public_id,
            url: result.secure_url
        },
     
  
      });
  
      const saveduserprofilepic = await userprofile.save();
  
      res.status(201).json(saveduserprofilepic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  

  module.exports={userprofile,getHome};
