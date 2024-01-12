const express = require("express");
const router = express.Router();
const multer = require("../models/admin/multerconfig");
// const resgister = require("../models/admin/mongodb");
require("dotenv").config();
// const secretKey = process.env.JWT_SECRET || 'defaultFallbackSecret';
const secretKey = "mynameissomethinglikestartwithathatsit";

// const jwtMiddleware = require('../middleware/authmiddleware');
// const authorizeRoles = require('../middleware/authmiddleware');
// const { authenticateJWT } = require("../middleware/authmiddleware");

const color = require("../models/admin/color");
const size = require("../models/admin/size");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const subcategory = require("../models/admin/subcategory");
const product = require("../models/admin/productAdd");
const category = require("../models/admin/category");
const cloudinary = require("../models/admin/cloudinary");
// const { isValidObjectId } = require('mongoose');
// const category = require('../models/admin/category');
// const cart =require('../models/admin/cart');
// const verifyToken=require('../controllers/authenticationMiddleware')
// const jwtMiddleware=require('../middleware/authmiddleware');


const adminControllers = require('../controllers/admin/admin/loginAdmin');
const { authenticateJWT } = require("../middleware/authmiddleware");
// const { getlogin } = require('../controllers/admin/loginAdmin');
// const { loginAdmin, signAdmin } = require("../controllers/admin/loginAdmin");

const upload = multer.single("image");
const productControllers = require('../controllers/admin/admin/AddProductpage');
const categoryControllers = require('../controllers/admin/admin/category');
const subCategoryControllers = require('../controllers/admin/admin/subcategory');
const otherControllers = require('../controllers/admin/admin/Others');



router.post("/login",adminControllers.loginAdmin);

router.get("/login",adminControllers.getlogin);

router.get("/signup", authenticateJWT,adminControllers.getsignup);

router.post("/signup",authenticateJWT,adminControllers.signAdmin);



// router.get("/home", authenticateJWT, getHome)



router.get("/productAdd", authenticateJWT,productControllers.getproductAdd);

router.post("/productAdd", upload, authenticateJWT,productControllers.getpostProductAdd);
router.delete("/delete/product/:id",productControllers.productDelete);
router.get("/productdetails",productControllers.getproductDetails);


router.post("/category", upload,categoryControllers.postCategory);


router.get("/categorylist",categoryControllers.getCategorylist);

router.get("/edit-category/:id",categoryControllers.editGetCategory);


router.delete("/delete/:id",categoryControllers.deleteCategory);

router.get("/delete",categoryControllers.getcategoryDelete);
router.get("/admin/categories",categoryControllers.getcategories);


router.post("/subcategories", upload,subCategoryControllers.postSubcategory);



router.get("/subcategories",subCategoryControllers.getsubcategories)


router.get("/admin/subcategory",subCategoryControllers.getsubcategory)


router.get("/admin/color",otherControllers.getcolor)
router.get("/admin/size",otherControllers.getsize)


// router.get("/Addcolor",otherControllers.getcolor)
router.get("/Addsize",otherControllers.getAddsize)

router.post("/color", upload,otherControllers.postcolor);
router.post("/size", upload,otherControllers.postSize);


// router.get("/delete", getDelete);







// router.get("/category", authenticateJWT, (req, res) => {
//     res.render("admin/category");
//   });
  
//   router.get("/edit", (req, res) => {
//     res.render("admin/edit");
//   });
//   router.get("/subcategory", authenticateJWT, (req, res) => {
//     res.render("admin/category");
//   });
// // Logout route
// router.get("/logout", (req, res) => {
//     res.clearCookie("token");
  
//     res.redirect("/admin/login");
//   });

// router.put("/edit-category/:categoryId", putCategory)




module.exports = router;
