const cloudinary = require("../../models/common/cloudinary");
const Homepagepic=require('../../models/admin/Homepagebar')
const multer = require("../../models/common/multerconfig");
const upload = multer.single("image");
const HomepageFooter =require ('../../models/admin/HomepagebarFooter')

let HomepagepicPost = async (req, res) => {
    try {
      const { h1, h2  } = req.body;
  
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






let HomepageFooterpost = async (req, res) => {
  try {
    const { h1, h2 ,description } = req.body;

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

    const newHomepageFooter = new HomepageFooter({
      h1: h1,
      h2: h2,
      description:description,
      image: {
          public_id: result.public_id,
          url: result.secure_url
      },
    //   image1: {
    //     public_id: result.public_id,
    //     url: result.secure_url
    // },

    });

    const savedHomepageFoot = await newHomepageFooter.save();

    res.status(201).json(savedHomepageFoot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  let HomepagepicGet = async (req, res) => {
    try {
        const Homepagepics = await Homepagepic.find();
        res.render('admin/HomepageControl', { home: Homepagepics });
    } catch (error) {
        console.error("Error fetching Homepagepic:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

let HomepageFooterGet=async (req, res) => {
  try {
      const Homepagepics = await HomepageFooter.find();
      res.render('admin/HomepageFooterImage', { homeFoot: Homepagepics });
  } catch (error) {
      console.error("Error fetching Homepagepic:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


let deleteBanner=async (req, res) => {
  try {
    const h1Id = req.params.id;
    const deleteBanners = await Homepagepic.findOneAndDelete({h1: h1Id });

    if (!deleteBanners) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({success:true});
  //   return res.redirect("/admin/HomepageControl");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting category data", error: error.message });
  }
};

  module.exports={HomepageFooterGet, HomepagepicPost ,HomepageFooterpost ,deleteBanner ,HomepagepicGet} ;