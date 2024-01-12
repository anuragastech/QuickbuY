const express = require("express");
const router = express.Router();
const multer = require("../models/admin/multerconfig");
const color = require("../models/admin/color");
const size = require("../models/admin/size");

const bcrypt = require("bcryptjs");
// const { isValidObjectId } = require('mongoose');
// const cart =require('../models/admin/cart');

const upload = multer.single("image");

const adminControllers = require('../controllers/admin/admin/loginAdmin');
const { authenticateJWT } = require("../middleware/authmiddleware");
const productControllers = require('../controllers/admin/admin/AddProductpage');
const categoryControllers = require('../controllers/admin/admin/category');
const subCategoryControllers = require('../controllers/admin/admin/subcategory');
const otherControllers = require('../controllers/admin/admin/Others');



router.post("/login",adminControllers.loginAdmin);

router.get("/login",adminControllers.getlogin);

router.get("/signup", authenticateJWT,adminControllers.getsignup);

router.post("/signup",authenticateJWT,adminControllers.signAdmin);



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
router.get('/main', (req, res) => {
    return res.render('admin/main');
});

// Logout route
router.get("/logout",adminControllers.logout )





// router.get("/category", authenticateJWT, (req, res) => {
//     res.render("admin/category");
//   });
  
//   router.get("/edit", (req, res) => {
//     res.render("admin/edit");
//   });
//   router.get("/subcategory", authenticateJWT, (req, res) => {
//     res.render("admin/category");
//   });


// router.put("/edit-category/:categoryId", putCategory)



// router.get("/home", authenticateJWT, getHome)

module.exports = router;
