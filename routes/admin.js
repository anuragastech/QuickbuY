const express = require("express");
const router = express.Router();

const { preventAccessToLoginSignup } =require('../middleware/preventAccess')

const Saved=require('../models/admin/saved')
const categoryControllers = require('../controllers/admin/category');
const subCategoryControllers = require('../controllers/admin/subcategory');
const otherControllers = require('../controllers/admin/Others');
const adminControllers=require('../controllers/admin/loginadmin')
const multer = require("../models/common/multerconfig");
const upload = multer.single("image");
const HomepageController= require('../controllers/admin/Homepage');
const userController= require('../controllers/admin/userController');
const { authenticateJWT } = require('../middleware/authmiddleware');

const venderBlockController=require('../controllers/admin/venderController')
const orderController= require('../controllers/admin/order');
const dashboardController= require('../controllers/admin/Dashboard');



router.get('/vender-product-list',authenticateJWT,otherControllers.venderlist)

router.get('/index',dashboardController.index)
router.get('/chart-data',dashboardController.chart)


router.get('/login',preventAccessToLoginSignup, (req,res)=>{
    res.render('admin/login')
})

router.get('/404', (req,res)=>{
    res.render('admin/404')
})

// ---------------------------------------------------------------------------------------------------------------
router.post('/HomepageFooterImage', upload,HomepageController.HomepageFooterpost );
router.get('/HomepageFooterImage',authenticateJWT,HomepageController.HomepageFooterGet)

router.post('/HomepageController', upload,HomepageController.HomepagepicPost );
router.get('/HomepageControl',authenticateJWT,HomepageController.HomepagepicGet)

router.post("/signup",adminControllers.AdminSignup);
router.get("/signup",preventAccessToLoginSignup,adminControllers.getsignUp);

router.get("/login",adminControllers.getlogin);
router.post("/loginpost",adminControllers.Addlogin);


router.post("/categorylist", upload,categoryControllers.postCategory);


router.get("/categorylist",authenticateJWT,categoryControllers.getCategorylist);

router.get("/edit",categoryControllers.editGetCategory);
router.post('/edit-categorylist',upload,categoryControllers.editpost)
router.post('/editSubcategorylist',upload,subCategoryControllers.editsubcategorypost)

// router.put('/editCategoryImage',categoryControllers.editput)

router.get("/edit-subcategory",subCategoryControllers.editGetsubCategory);
router.post('/edit-subcategory/:id',subCategoryControllers.editsubcategorypost)
router.delete("/deleteBannerfoot/:id",HomepageController.deleteBannerfoot);

router.delete("/deleteBanner/:id",HomepageController.deleteBanner);


router.delete("/deleteVender/:id",otherControllers.deletVender);

router.delete("/deleteUser/:id",otherControllers.deleteUser);

router.delete("/delete/:id",categoryControllers.deleteCategory);
router.delete("/delete-subcategory/:id",subCategoryControllers.deleteSubCategory);

router.get("/delete",categoryControllers.getcategoryDelete);
router.get("/categories",categoryControllers.getcategories);


router.post("/subcategories", upload,subCategoryControllers.postSubcategory);



router.get("/subcategories",authenticateJWT,subCategoryControllers.getsubcategories)


router.get("/admin/subcategory",subCategoryControllers.getsubcategory);

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
router.get("/User",authenticateJWT, otherControllers.userlist  )
router.get("/Vender",authenticateJWT, otherControllers.venderadmin)

router.post('/block-user/:userId',  userController.blockUser);
router.post('/unblock-user/:userId',  userController.unblockUser);


router.post('/block-vender/:userId',  venderBlockController.blockVender);
router.post('/unblock-vender/:userId',  venderBlockController.unblockVender);


router.delete('/admin/delete',otherControllers.deleteCoupen)
router.get('/coupen',authenticateJWT,otherControllers.getCoupen)
router.post('/coupon',otherControllers.postCoupen)
router.get('/orderList',authenticateJWT,orderController.order )
router.post('/updateShippingStatus',orderController.shippingStatus)
router.post('/OrderShippingStatus',orderController.orderStatus)

router.post('/forgot-password',adminControllers.forgotPassword)
router.post('/verify-otp',adminControllers.veryfyOtp) 
router.get('/reset-password',adminControllers.getResetPassword) 
router.post('/resetpassword',adminControllers.resetpasword) 

router.get('/ResetPassword',(req,res)=>{
  res.render('admin/ResetPassword')
  });
  router.get('/matchEmail',(req,res)=>{
    res.render('admin/matchEmail')
    });
// Dashboard route 



module.exports = router;
