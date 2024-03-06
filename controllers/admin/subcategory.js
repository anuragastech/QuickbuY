const cloudinary = require("../../models/common/cloudinary");
const subcategory = require("../../models/admin/subcategory");

let postSubcategory = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const desiredWidth = 400;
    const desiredHeight = 400;

    const photo = await cloudinary.uploader.upload(req.file.path, {
      width: desiredWidth,
      height: desiredHeight,
      crop: "scale",
    });

    const newsubCategory = new subcategory({
      title: title,
      description: description,
      image: {
        public_id: photo.public_id,
        url: photo.secure_url,
      },
      // category: category,
    });

    const savedCategory = await newsubCategory.save();

    res.cookie('alert', 'Subcategory added successfully', { maxAge: 3000 });

    res.redirect('/admin/subcategories');
  } catch (error) {
    console.error(error);
    // Redirect to the 404 page
    res.redirect('/admin/404');
}
};


let getsubcategory = async (req, res) => {
  try {
    const subcategories = await subcategory.find();
    res.json({ subcategories });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
let getsubcategories = async (req, res) => {
  try {
    const subcategories = await subcategory.find({}, "title description image");

    res.render("admin/subcategories", { subcategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

let deleteSubCategory= async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const deleteSubCategorys = await subcategory.findOneAndDelete({ _id: subcategoryId });

    if (!deleteSubCategorys) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({success:true});
  //   return res.redirect("/admin/categorylist");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting category data", error: error.message });
  }
};
let editGetsubCategory= async (req, res) => {
  try {
      const subcategoryId = req.query.name;
      const subcategorys = await subcategory.findOne({ _id: subcategoryId });
      // console.log(subcategoryId);

      if (!subcategorys) {
          return res.status(404).json({ success: false, message: 'subCategory not found' });
      }

      res.render('admin/edit-subcategory', { subta: subcategorys });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
  }
};

// let editsubcategorypost = async (req, res) => {
//   try {
//       const subcategoryId = req.params.id;  
//       const { title, description } = req.body;

//       if (!title || !description) {
//           return res.status(400).json({ success: false, message: 'Incomplete data for category update' });
//       }

//       const updatedsubCategory = await subcategory.findOneAndUpdate(
//           { _id: subcategoryId },
//           {
//               $set: {
//                   title: title,
//                   description: description,
//               },
//           },
//           { new: true } 
//       );
      
//       res.render('admin/subcategorylist')

     
//       res.status(200).json({ success: true, message: 'subCategory updated successfully', updatedsubCategory });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false });
//     }
//   };

  const editsubcategorypost = async (req, res) => {
    try {
        const { subcategoryId, title, description } = req.body;
console.log(subcategoryId);
        const updatedSubCategory = await subcategory.findOneAndUpdate(
            { _id: subcategoryId },
            {
                $set: {
                    title: title,
                    description: description,
                },
            },
            { new: true }
        );
        console.log(updatedSubCategory);

        if (!updatedSubCategory) {
            return res.status(404).json({ success: false, message: 'SubCategory not found' });
        }

        const desiredWidth = 400;
        const desiredHeight = 400;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                width: desiredWidth,
                height: desiredHeight,
                crop: 'scale',
            });
// console.log(result);
            await cloudinary.uploader.destroy(updatedSubCategory.image.public_id);

            updatedSubCategory.image.public_id = result.public_id;
            updatedSubCategory.image.url = result.secure_url;

            await updatedSubCategory.save();
        }


        res.redirect('/admin/categorylist');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {editsubcategorypost, getsubcategories, getsubcategory,deleteSubCategory, editGetsubCategory,postSubcategory };
