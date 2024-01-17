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

router.get("/signup",venderControllers.getsignup);

router.post("/signup",authenticateJWT,venderControllers.signvender);



router.get("/productAdd", authenticateJWT,productControllers.getproductAdd);

router.post("/productAdd", upload, authenticateJWT,productControllers.getpostProductAdd);
router.delete("/delete/product/:id",productControllers.productDelete);
router.get("/productdetails",productControllers.getproductDetails);
router.get('/edit-product', productControllers.geteditProduct)
router.post('/edit-product/:id',authenticateJWT,productControllers.postedit)


router.get('/main', (req, res) => {
    return res.render('vender/main');
});

// Logout route
router.get("/logout",venderControllers.logout )






// router.get("/home", authenticateJWT, getHome)




router.get('/categories', getcatasubController.getcategory)
  
  router.get('/subcategory',getcatasubController.getsubcategory)

  router.get('/color',getcatasubController.getcolor)
  router.get('/size', getcatasubController.getsize)
  


module.exports = router;
