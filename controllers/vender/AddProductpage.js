const product = require("../../models/vender/productAdd");
const cloudinary = require("../../models/common/cloudinary");


getpostProductAdd=async(req,res)=>{
    try {
        const { productname, manufacturename, brand, price, description, category, subcategory,size,color,count} = req.body;
        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'File not provided' });
        }

        const desiredWidth = 300;
        const desiredHeight = 200;

        const photo = await cloudinary.uploader.upload(req.file.path, {
            width: desiredWidth,
            height: desiredHeight,
            crop: 'scale'
        });

        const newProduct = new product({
            productname: productname,
            manufacturename: manufacturename,
            brand: brand,
            price: price,
            description: description,
            userId: userId,
            category: category,
            subcategory: subcategory,
            size:size,
            color:color,
            Quantity: count, 

            image: {
                public_id: photo.public_id,
                url: photo.secure_url,
            },
        });

        const savedProduct = await newProduct.save();

        res.redirect(`/vender/productdetails`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


productDelete=async(req,res)=>{
    try {
        const productId = req.params.id;
        const deleteproduct = await product.findOneAndDelete({ productname: productId });
    
        if (!deleteproduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "successfully deleted" });
  
      //   return res.redirect("/vender/productdetails");
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product data", error: error.message });
      }
    };
  getDelete=(req, res) => {
        res.redirect("/vender/productdetails");
      };
      
 getproductDetails= async (req, res) => {
        try {
          const products = await product
            .find()
            .populate("category")
            .populate("subcategory");
          res.render("vender/productdetails", { products });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: "Internal Server Error" });
        }
      };

    getproductAdd= (req, res) => {
        res.render("vender/productAdd");
      };
module.exports={productDelete,getDelete,getpostProductAdd,getproductAdd,getproductDetails};