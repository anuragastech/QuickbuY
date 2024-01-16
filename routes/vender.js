const express = require("express");
const router = express.Router();
const multer = require("../models/common/multerconfig");
const color = require("../models/vender/color");
const size = require("../models/vender/size");

const bcrypt = require("bcryptjs");
// const { isValidObjectId } = require('mongoose');
// const cart =require('../models/vender/cart');

const upload = multer.single("image");

const venderControllers = require('../controllers/vender/loginVender');
const { authenticateJWT } = require("../middleware/authmiddleware");
const productControllers = require('../controllers/vender/AddProductpage');

const otherControllers = require('../controllers/vender/Others');



router.post("/login",venderControllers.loginvender);

router.get("/login",venderControllers.getlogin);

router.get("/signup",venderControllers.getsignup);

router.post("/signup",authenticateJWT,venderControllers.signvender);



router.get("/productAdd", authenticateJWT,productControllers.getproductAdd);

router.post("/productAdd", upload, authenticateJWT,productControllers.getpostProductAdd);
router.delete("/delete/product/:id",productControllers.productDelete);
router.get("/productdetails",productControllers.getproductDetails);


// router.get("/delete", getDelete);

router.get('/main', (req, res) => {
    return res.render('vender/main');
});

// Logout route
router.get("/logout",venderControllers.logout )





// router.get("/category", authenticateJWT, (req, res) => {
//     res.render("vender/category");
//   });
  
//   router.get("/edit", (req, res) => {
//     res.render("vender/edit");
//   });
//   router.get("/subcategory", authenticateJWT, (req, res) => {
//     res.render("vender/category");
//   });


// router.put("/edit-category/:categoryId", putCategory)



// router.get("/home", authenticateJWT, getHome)

router.get('/edit-product', productControllers.geteditProduct)
router.post('/edit-product/:id',authenticateJWT,productControllers.postedit)

module.exports = router;
