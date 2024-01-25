const express = require("express");
const router = express.Router();
const multer = require("../models/common/multerconfig");

const getcatasubController=require('../controllers/vender/getcategorysub')
// const bcrypt = require("bcryptjs");

const upload = multer.single("image");

const venderControllers = require('../controllers/vender/loginVender');
const { authenticateJWT } = require("../middleware/authmiddleware");
const productControllers = require('../controllers/vender/AddProductpage');

// const otherControllers = require('../controllers/vender/Others');



router.post("/login",venderControllers.loginvender);

router.get("/login",venderControllers.getlogin);

router.get("/signup",authenticateJWT,venderControllers.getsignup);

router.post("/signup",authenticateJWT,venderControllers.signvender);



router.get("/productAdd", authenticateJWT,productControllers.getproductAdd);

router.post("/productAdd", upload, authenticateJWT,productControllers.getpostProductAdd);
router.delete("/delete/product/:id",authenticateJWT,productControllers.productDelete);
router.get("/productdetails",authenticateJWT,productControllers.getproductDetails);
router.get('/edit-product',authenticateJWT, productControllers.geteditProduct)
router.post('/edit-product/:id',authenticateJWT,productControllers.postedit)


// Logout route
router.get("/logout",authenticateJWT,venderControllers.logout )






// router.get("/home", authenticateJWT, getHome)



router.get('/main', authenticateJWT,(req, res) => {
  return res.render('vender/main');
});
router.get('/home', (req, res) => {
  return res.render('vender/home');
});



router.get('/categories',authenticateJWT, getcatasubController.getcategory)
  
  router.get('/subcategory',authenticateJWT,getcatasubController.getsubcategory)

  router.get('/color',authenticateJWT,getcatasubController.getcolor)
  router.get('/size', authenticateJWT,getcatasubController.getsize)
  

  // router('/home',(req,res)=>{
  //   res.render('vender/home')
  // })

  


module.exports = router ;
