const cloudinary = require("../../models/common/cloudinary");
const category = require('../../models/admin/category');


let postCategory= async(req,res)=>{
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

        res.redirect('/admin/categorylist');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

let getCategorylist = async (req, res) => {
  try {
      // Extracting query parameters for filtering and specific category ID
      const { id, title, description, image } = req.query;

      // Query to fetch all categories
      const categoryList = await category.find({}, 'id title description image');

      // Extracting category ID from query parameters (assuming it's passed as 'name')
      const categoryId = req.query.id;

      // Query to find a single category by its ID
      const categorys = await category.findOne({ _id: categoryId });

      console.log(categorys); // Logging the fetched category

      // Check if category list is empty (null or empty array)
      if (!categoryList || categoryList.length === 0) {
          return res.status(500).json({ success: false, message: 'No categories found' });
      }

      // Render the 'admin/categorylist' view, passing both category list and single category data
      res.render('admin/categorylist', { categories: categoryList, cata: categorys });

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// let editGetCategory= async (req, res) => {
//   try {
//       const categoryId = req.query.name;
//       const categorys = await category.findOne({ _id: categoryId });
//       console.log(categoryId);

//       if (!categorys) {
//           return res.status(404).json({ success: false, message: 'Category not found' });
//       }

//       res.render('admin/categorylist', { cata: categorys });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false });
//   }
// };


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
 let editpost = async (req, res) => {
    try {
        const categoryId = req.params.id;  // Use req.params to get the category ID from the route
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Incomplete data for category update' });
        }

        const updatedCategory = await category.findOneAndUpdate(
            { _id: categoryId },
            {
                $set: {
                    title: title,
                    description: description,
                },
            },
            { new: true } 
        );
        
        res.render('admin/categorylist')

       
        res.status(200).json({ success: true, message: 'Category updated successfully', updatedCategory });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
  
module.exports={editpost,putCategory,getcategoryDelete,getcategories,deleteCategory,postCategory,getCategorylist};