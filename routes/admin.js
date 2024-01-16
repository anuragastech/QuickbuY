const express = require("express");
const router = express.Router();
const Saved=require('../models/admin/saved')
const categoryControllers = require('../controllers/admin/category');
const subCategoryControllers = require('../controllers/admin/subcategory');
const otherControllers = require('../controllers/admin/Others');
const adminControllers=require('../controllers/admin/loginadmin')
const multer = require("../models/common/multerconfig");
const upload = multer.single("image");


router.get('/main', otherControllers.getmain)

router.post("/login",adminControllers.loginPost);

router.get("/login",adminControllers.getlogin);

router.post("/category", upload,categoryControllers.postCategory);


router.get("/categorylist",categoryControllers.getCategorylist);

router.get("/edit",categoryControllers.editGetCategory);
router.post('/edit-category/:id',categoryControllers.editpost)

router.delete("/delete/:id",categoryControllers.deleteCategory);

router.get("/delete",categoryControllers.getcategoryDelete);
router.get("/admin/categories",categoryControllers.getcategories);


router.post("/subcategories", upload,subCategoryControllers.postSubcategory);



router.get("/subcategories",subCategoryControllers.getsubcategories)


router.get("/admin/subcategory",subCategoryControllers.getsubcategory);


router.get("/admin/color",otherControllers.getcolor);
router.get("/admin/size",otherControllers.getsize);


// router.get("/Addcolor",otherControllers.getcolor)
router.get("/Addsize",otherControllers.getAddsize);

// router.post("/color", upload,otherControllers.postcolor);
router.post("/size", upload,otherControllers.postSize);



// Logout route
router.get("/logout",adminControllers.logout )





module.exports = router;
