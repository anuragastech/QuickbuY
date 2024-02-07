const product = require("../../models/vender/productAdd");
const cloudinary = require("../../models/common/cloudinary");

const getpostProductAdd = async (req, res) => {
  try {
    const {
      productname,
      manufacturename,
      brand,
      price,
      description,
      color,
      category,
      subcategory,
      sizes,      // Change from "products" to "sizes"
      quantity, // Change from "products" to "quantities"
    } = req.body;

    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "File not provided" });
    }

    const desiredWidth = 640;
    const desiredHeight = 640;

    const photo = await cloudinary.uploader.upload(req.file.path, {
      width: desiredWidth,
      height: desiredHeight,
      crop: "scale",
    });
    // console.log(sizes);
    const properties = []; // Array to store the objects with size and quantity

    // Combine sizes and quantities into an array of objects
    for (let i = 0; i < sizes.length; i++) {
      properties.push({ size: sizes[i], quantity: quantity[i] });
    }

    const newProduct = new product({
      productname: productname,
      manufacturename: manufacturename,
      brand: brand,
      price: price,
      description: description,
      userId: userId,
      category: category,
      subcategory: subcategory,
      color: color,
      properties: properties, // Assigning the combined array of objects
      image: {
        public_id: photo.public_id,
        url: photo.secure_url,
      },
    });

    const savedProduct = await newProduct.save();

    res.redirect(`/vender/productlist`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


let productDelete = async (req, res) => {
  try {
    const productId = req.params.id;
    const deleteproduct = await product.findOneAndDelete({
      productname: productId,
    });

    if (!deleteproduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "successfully deleted" });

    //   return res.redirect("/vender/productdetails");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting product data", error: error.message });
  }
};
let getDelete = (req, res) => {
  res.redirect("/vender/productdetails");
};

let getproductDetails = async (req, res) => {
  try {
    const products = await product
      .find()
      .populate("category")
      .populate("subcategory");
    res.render("vender/productlist", { products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

let getproductAdd = (req, res) => {
  res.render("vender/productAdd");
};

let postedit = async (req, res) => {
  try {
    const productId = req.params.id; // Use req.params to get the category ID from the route
    const {
      productname,
      manufacturename,
      brand,
      price,
      description,
      color,
      category,
      subcategory,
      size,
      quantity,
    } = req.body;
    const userId = req.user._id;

    if (!productname || !description) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Incomplete data for product update",
        });
    }
    const desiredWidth = 600;
    const desiredHeight = 300;

    // const photo = await cloudinary.uploader.upload(req.file.path, {
    //     width: desiredWidth,
    //     height: desiredHeight,
    //     crop: 'scale'
    // });

    const updatedProduct = await product.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          productname: productname,
          manufacturename: manufacturename,
          brand: brand,
          price: price,
          description: description,
          userId: userId,
          category: category,
          subcategory: subcategory,
          size: size,
          color: color,
          Quantity:quantity,

          // image: {
          //     public_id: photo.public_id,
          //     url: photo.secure_url,
          // },
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "product updated successfully",
        updatedProduct,
      });
    res.redirect("vender/productdetails");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

let geteditProduct = async (req, res) => {
  try {
    const productId = req.query.name;
    const products = await product.findOne({ _id: productId });
    // console.log(productId);

    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }

    res.render("vender/edit-product", { prod: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
module.exports = {
  postedit,
  geteditProduct,
  productDelete,
  getDelete,
  getpostProductAdd,
  getproductAdd,
  getproductDetails,
};
