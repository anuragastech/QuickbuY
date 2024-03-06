const cloudinary = require("../../models/common/cloudinary");
const category = require('../../models/admin/category');
// const { request } = require("express");
// const multer = require("../../models/common/multerconfig");

// const upload = multer.single("image");


let postCategory = async (req, res) => {
  try {
      const { title, description } = req.body;

      if (!req.file) {
          return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const desiredWidth = 300;
      const desiredHeight = 200;

      const result = await cloudinary.uploader.upload(req.file.path, {
          width: desiredWidth,
          height: desiredHeight,
          crop: 'scale' 
      });
      
      const newCategory = new category({
          title: title,
          description: description,
          image: {
              public_id: result.public_id,
              url: result.secure_url
          },
      });
      
      const savedCategory = await newCategory.save();

      // Set an alert message in a cookie
      res.cookie('alert', 'Category added successfully', { maxAge: 3000 });

      res.redirect('/admin/categorylist');
      
    } catch (error) {
      console.error(error);
      // Redirect to the 404 page
      res.redirect('/admin/404');
  }
};


let getCategorylist= async (req, res) => {
    try {
        const { id ,title, description, image } = req.query;
       
        const categoryList = await category.find({}, ' id title description image');

       


        if (!categoryList) {
            return res.status(500).json({ success: false });
        }

        res.render('admin/categorylist', { categories: categoryList});
          } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
    
};


let editGetCategory= async (req, res) => {
  try {
      const categoryId = req.query.name;
      const categorys = await category.findOne({ _id: categoryId });
      // console.log(categoryId);

      if (!categorys) {
          return res.status(404).json({ success: false, message: 'Category not found' });
      }

      res.render('admin/edit', { cata: categorys });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
  }
};


let deleteCategory= async (req, res) => {
    try {
      const categoryId = req.params.id;
      const deleteCategory = await category.findOneAndDelete({ title: categoryId });
  
      if (!deleteCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({success:true});
    //   return res.redirect("/admin/categorylist");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting category data", error: error.message });
    }
  };

let  getcategories=async (req, res) => {
  
    try {
      const categories = await category.find();
      res.json({ categories });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  let  getcategoryDelete=(req, res) => {
    res.redirect("/admin/categorylist");
  };

  let  putCategory=async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const { title, description } = req.body;
  
      if (!title || !description) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Incomplete data for category update",
          });
      }
  
      const updatedCategory = await category.updateOne(
        { _id: ObjectId(categoryId) },
        {
          $set: {
            title: title,
            description: description,
          },
        },
        { new: true }
      );
  
      res
        .status(200)
        .json({
          success: true,
          message: "Category updated successfully",
          updatedCategory,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  };




  const editpost = async (req, res) => {
    try {
        const { categoryIds, title, description } = req.body;

        const updatedCategory = await category.findOneAndUpdate(
            { _id: categoryIds },
            {
                $set: {
                    title: title,
                    description: description,
                },
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const desiredWidth = 300;
        const desiredHeight = 200;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                width: desiredWidth,
                height: desiredHeight,
                crop: 'scale',
            });
// console.log(result);
            await cloudinary.uploader.destroy(updatedCategory.image.public_id);

            updatedCategory.image.public_id = result.public_id;
            updatedCategory.image.url = result.secure_url;

            await updatedCategory.save();
        }


        res.redirect('/admin/categorylist');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};





// const editput = async (req, res) => {
//   try {
//     const { image } = req.body;

//     // Find the existing image data in your database
//     const datares = await category.findOne({ 'image.public_id': image });
//     if (!datares) {
//       return res.status(404).send({ status: "error", message: "Image not found" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'No file uploaded' });
//     }

//     // Upload the new image to Cloudinary
//     const desiredWidth = 300;
//     const desiredHeight = 200;
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       width: desiredWidth,
//       height: desiredHeight,
//       crop: 'scale' 
//     });

//     // Destroy the existing image in Cloudinary
//     await cloudinary.uploader.destroy(datares.image.public_id);

//     // Update the image URL and public ID in your database
//     await category.findOneAndUpdate(
//       { 'image.public_id': image },
//       { 'image.url': result.secure_url, 'image.public_id': result.public_id },
//       { new: true } // To return the updated document
//     );

//     // Send success response
//     res.status(200).send({
//       status: "success",
//       data: {
//         message: "Image updated successfully"
//       }
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send({ status: "error", message: "Internal server error" });
//   }
// };

  
module.exports={editpost,putCategory,getcategoryDelete,getcategories, editGetCategory,deleteCategory,postCategory,getCategorylist};