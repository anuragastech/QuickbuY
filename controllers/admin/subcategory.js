const cloudinary = require("../../models/common/cloudinary");
const subcategory = require("../../models/admin/subcategory");



postSubcategory=async (req,res)=>{


 try {
    const { title, description,category } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const desiredWidth = 300;
    const desiredHeight = 200;

    const photo = await cloudinary.uploader.upload(req.file.path, {
        width: desiredWidth,
        height: desiredHeight,
        crop: 'scale' 
    });

    
    
    const newsubCategory = new subcategory({
        title: title,
        description: description,
        image: {
            public_id: photo.public_id,
            url: photo.secure_url
        },
        category: category,
    });


    const savedCategory = await newsubCategory.save();

    res.render('admin/subcategories', { subcategory: savedCategory });
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
}
};

getsubcategory= async (req, res) => {
    try {
      const subcategories = await subcategory.find();
      res.json({ subcategories });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getsubcategories=async (req, res) => {
    try {
      const subcategories = await subcategory.find({}, "title description image");
  
      res.render("admin/subcategories", { subcategories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  module.exports={getsubcategories,getsubcategory,postSubcategory};