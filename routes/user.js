const express = require('express');
const router=express.Router();


const { authenticateJWT } = require('../middleware/authmiddleware');

const userControllers = require('../controllers/user/loginUser');
const getCategoryControllers = require('../controllers/user/category');
const getCartControllers = require('../controllers/user/cart');
const getSubcategoryControllers = require('../controllers/user/subcategory');
const getProductControllers = require('../controllers/user/Product');
const getAllControllers = require('../controllers/user/getAll');
const getControllerHome=require('../controllers/user/home')
const getPaymentway=require('../controllers/user/paymentgateway')
const  OrderMiddileware  = require('../controllers/user/order');
const multer = require("../models/common/multerconfig");
const upload = multer.single("image");
const OrderController=require('../controllers/user/order')


router.post('/sign',userControllers.Addsign)

router.post('/login',userControllers.Addlogin)

router.get('/sign',userControllers.getsign)

router.get('/login',userControllers.getlogin)

// Logout route
router.get("/logout",authenticateJWT,userControllers.getlogout)

// router.get('/index' ,getAllControllers.getindex);
router.get('/login',authenticateJWT,getAllControllers.getlogin)
router.get('/category',authenticateJWT,getCategoryControllers.getcategory)

router.get('/contact',getAllControllers.getcontact)


router.get('/user',authenticateJWT,getAllControllers.getuser)


    router.get('/categories/:id',getSubcategoryControllers.getsubcategories)

    

router.get('/productpage', getProductControllers.getproductpage)


router.get('/products',getProductControllers.getproductData)
router.get('/',getControllerHome.getproductDataIn)


router.delete("/deletecart/:id",getCartControllers.deleteCart);



router.post('/updateCart/:cartId', authenticateJWT, getCartControllers.updateCart);

// router.get('/cart',authenticateJWT, getCartControllers.getcartpage)

// router.get('/cartlist', authenticateJWT,getCartControllers.getcartlist)





router.post('/cart/product', authenticateJWT, getCartControllers.postcart);
router.get('/shopping-cart',authenticateJWT,getCartControllers.getshoppingcart)



router.get('/payment',(req,res)=>{
    res.render('user/payment')
    });
    router.get('/triel',(req,res)=>{
      res.render('user/triel')
      });
    
    

    // router.get('/products',(req,res)=>{
    //   res.render('user/products')
    //   });
// router.get('/productpage',getProductControllers.productpage)

  // router.get('/productpage',getProductControllers.productpass)




  router.post('/products',authenticateJWT,getProductControllers.getproductData)

 router.post('/checkout',authenticateJWT, getPaymentway.postAddress)

 
 
 router.get('/check-out',authenticateJWT, getPaymentway.getAddress)
//  router.post('/checkoutpost',authenticateJWT,getPaymentway.postCarttocheckout)
 router.post('/applycoupon',authenticateJWT, getPaymentway.coupencheck)

router.post('/order',authenticateJWT, getPaymentway.orderPost)

// router.put("/cart/selectedProduct",authenticateJWT,getPaymentway.cartProductSelected)

router.post("/send-mail",userControllers.sendmail)


router.post('/profileData',authenticateJWT,userControllers.profileData)

router.get('/about',getAllControllers.about)
router.get('/profile',authenticateJWT,userControllers.GetProfile )
router.post('/postAddress',authenticateJWT, userControllers.postAddresses)
router.post('/profileUpdateImage',upload, authenticateJWT, userControllers.postProfilepic)


router.post('/forgot-password',userControllers.forgotPassword)
router.post('/verify-otp',userControllers.veryfyOtp) 
router.get('/reset-password',userControllers.getResetPassword) 
router.post('/resetpassword',userControllers.resetpasword) 

router.get('/ResetPassword',(req,res)=>{
  res.render('user/ResetPassword')
  });

  router.get('/matchEmail',(req,res)=>{
    res.render('user/matchEmail')
    });


    router.get('/OrderDetails',authenticateJWT,OrderController.orderGet)

router.post('/OrderDetailses',OrderController.PostOrder)


router.get('/search',getControllerHome.Search)


router.delete('/addressDelete/:id',getPaymentway.deleteAddress)

module.exports = router;









