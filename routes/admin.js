const express = require("express");
const router = express.Router();
const Saved=require('../models/admin/saved')
const categoryControllers = require('../controllers/admin/category');
const subCategoryControllers = require('../controllers/admin/subcategory');
const otherControllers = require('../controllers/admin/Others');
const adminControllers=require('../controllers/admin/loginadmin')
const multer = require("../models/common/multerconfig");
const upload = multer.single("image");
const HomepageController= require('../controllers/admin/Homepage');


router.get('/blank',(req,res)=>{
    res.render('admin/blank')
})


router.get('/vender-product-list',otherControllers.venderlist)


router.get('/index',(req,res)=>{
    res.render('admin/index')
})
router.get('/alert',(req,res)=>{
    res.render('admin/alert')
})

router.get('/badge', (req,res)=>{
    res.render('admin/badge')
})

router.get('/login', (req,res)=>{
    res.render('admin/login')
})

router.get('/accordion',(req,res)=>{
    res.render('admin/accordion')
})




























// ---------------------------------------------------------------------------------------------------------------

router.post('/HomepageController', upload,HomepageController.HomepagepicPost );
router.get('/HomepageControl',HomepageController.HomepagepicGet)
router.get('/main', otherControllers.getmain);

router.post("/login",adminControllers.loginPost);

router.get("/login",adminControllers.getlogin);

router.post("/categorylist", upload,categoryControllers.postCategory);


router.get("/categorylist",categoryControllers.getCategorylist);

router.get("/edit-categorylist",categoryControllers.getCategorylist);
router.post('/edit-categorylist/:id',categoryControllers.editpost)

router.get("/edit-subcategory",subCategoryControllers.editGetsubCategory);
router.post('/edit-subcategory/:id',subCategoryControllers.editsubcategorypost)



router.delete("/delete/:id",categoryControllers.deleteCategory);
router.delete("/delete-subcategory/:id",subCategoryControllers.deleteSubCategory);

router.get("/delete",categoryControllers.getcategoryDelete);
router.get("/categories",categoryControllers.getcategories);


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

router.get("/home",(req,res)=>{
    res.render('admin/home')
})
router.get("/category",(req,res)=>{
    res.render('admin/category')
})
router.get("/edit-subcategory",(req,res)=>{
    res.render('admin/edit-subcategory')
})



module.exports = router;
