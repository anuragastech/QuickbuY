const express = require("express");
const router = express.Router();
const multer = require("../models/common/multerconfig");


const { preventAccessToLoginSignup } =require('../middleware/preventAccess')

const getcatasubController=require('../controllers/vender/getcategorysub')
// const bcrypt = require("bcryptjs");

const upload = multer.single("image");

const venderControllers = require('../controllers/vender/loginVender');
const { authenticateJWT } = require("../middleware/authmiddleware");
const productControllers = require('../controllers/vender/AddProductpage');

const otherControllers  = require('../controllers/vender/Others');
const profileControllers = require('../controllers/vender/profile');
const ordersControls  = require('../controllers/vender/order')

router.post("/loginPost",venderControllers.loginvender);

router.get("/login",preventAccessToLoginSignup,venderControllers.getlogin);

router.get("/signup",preventAccessToLoginSignup,venderControllers.getsignup);

router.post("/signup",venderControllers.signvender);



router.get("/productAdd", authenticateJWT,productControllers.getproductAdd);

router.post("/productAdd", upload, authenticateJWT,productControllers.getpostProductAdd);
router.delete("/delete/product/:id",authenticateJWT,productControllers.productDelete);
router.get("/productlist",authenticateJWT,productControllers.getproductDetails);
router.get('/edit-product',authenticateJWT, productControllers.geteditProduct)
router.post('/edit-product/:id',authenticateJWT,productControllers.postedit)
const dashboardController= require('../controllers/vender/Dashboard');



// Logout route
router.get("/logout",authenticateJWT,venderControllers.logout )




router.get('/index',authenticateJWT,dashboardController.index)
router.get('/chart-data',authenticateJWT,dashboardController.chart)


router.get('/profile',authenticateJWT, profileControllers.profileget)


router.get('/pagination', (req, res) => {
  return res.render('vender/pagination');
});




// router.get("/home", authenticateJWT, getHome)
router.get('/forgot-password', (req, res) => {
  return res.render('vender/forgot-password');
});



router.get('/main', authenticateJWT,(req, res) => {
  return res.render('vender/main');
});
router.get('/home', (req, res) => {
  return res.render('vender/home');
});

router.post('/profile',upload,authenticateJWT,profileControllers.createvenderProfile)

router.get('/categories',authenticateJWT, getcatasubController.getcategory)
  
  router.get('/subcategory',authenticateJWT,getcatasubController.getsubcategory)

  router.get('/color',authenticateJWT,getcatasubController.getcolor)
  router.get('/size', authenticateJWT,getcatasubController.getsize)

  router.get('/orderDetails',authenticateJWT,ordersControls.orderlist)
  router.post('/updateShippingStatus',ordersControls.shippingStatus)
router.post('/OrderShippingStatus',ordersControls.orderStatus)



router.post('/forgot-password',venderControllers.forgotPassword)
router.post('/verify-otp',venderControllers.veryfyOtp) 
router.get('/reset-password',venderControllers.getResetPassword) 
router.post('/resetpassword',venderControllers.resetpasword) 

router.get('/ResetPassword',(req,res)=>{
  res.render('vender/ResetPassword')
  });
  router.get('/matchEmail',(req,res)=>{
    res.render('vender/matchEmail')
    });




  

// dashboard  



module.exports = router ;
