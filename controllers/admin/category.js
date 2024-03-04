const cloudinary = require("../../models/common/cloudinary");
const category = require('../../models/admin/category');


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

  let editpost = async (req, res) => {
    try {
        const categoryId = req.body;  
        const { title, description } = req.body;

        console.log('Received request to update category with ID:', categoryId);
        console.log('Received data:', req.body);

        // Validate if title and description are provided
        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Incomplete data for category update' });
        }

        // Update the category based on the provided data
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

        console.log('Updated category:', updatedCategory);

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found or not updated' });
        }

        return res.status(200).json({ success: true, message: 'Category updated successfully', updatedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

  
module.exports={editpost,putCategory,getcategoryDelete,getcategories, editGetCategory,deleteCategory,postCategory,getCategorylist};