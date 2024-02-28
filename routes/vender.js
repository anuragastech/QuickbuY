const express = require("express");
const router = express.Router();
const multer = require("../models/common/multerconfig");

const getcatasubController=require('../controllers/vender/getcategorysub')
// const bcrypt = require("bcryptjs");

const upload = multer.single("image");

const venderControllers = require('../controllers/vender/loginVender');
const { authenticateJWT } = require("../middleware/authmiddleware");
const productControllers = require('../controllers/vender/AddProductpage');

const otherControllers = require('../controllers/vender/Others');
const profileControllers = require('../controllers/vender/profile');
const ordersControls  = require('../controllers/vender/order')

router.post("/login",venderControllers.loginvender);

router.get("/login",venderControllers.getlogin);

router.get("/signup",venderControllers.getsignup);

router.post("/signup",authenticateJWT,venderControllers.signvender);



router.get("/productAdd", authenticateJWT,productControllers.getproductAdd);

router.post("/productAdd", upload, authenticateJWT,productControllers.getpostProductAdd);
router.delete("/delete/product/:id",authenticateJWT,productControllers.productDelete);
router.get("/productlist",authenticateJWT,productControllers.getproductDetails);
router.get('/edit-product',authenticateJWT, productControllers.geteditProduct)
router.post('/edit-product/:id',authenticateJWT,productControllers.postedit)



// Logout route
router.get("/logout",authenticateJWT,venderControllers.logout )




router.get('/index', (req, res) => {
  return res.render('vender/index');
});

router.get('/profile', profileControllers.profileget)


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

router.post('/profile',profileControllers.createvenderProfile)

router.get('/categories',authenticateJWT, getcatasubController.getcategory)
  
  router.get('/subcategory',authenticateJWT,getcatasubController.getsubcategory)

  router.get('/color',authenticateJWT,getcatasubController.getcolor)
  router.get('/size', authenticateJWT,getcatasubController.getsize)

  router.get('/orderDetails',ordersControls.orderlist)
  


module.exports = router ;
