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





router.post('/sign',userControllers.Addsign)

router.post('/login',userControllers.Addlogin)

router.get('/sign',userControllers.getsign)

router.get('/login',userControllers.getlogin)

// Logout route
router.get("/logout",authenticateJWT,userControllers.getlogout)

// router.get('/index' ,getAllControllers.getindex);
router.get('/login',authenticateJWT,getAllControllers.getlogin)
router.get('/category',authenticateJWT,getCategoryControllers.getcategory)
router.get('/check-out',authenticateJWT,getAllControllers.getcheckout)
router.get('/contact',authenticateJWT,getAllControllers.getcontact)


router.get('/user',authenticateJWT,getAllControllers.getuser)


    router.get('/categories/:id',authenticateJWT,getSubcategoryControllers.getsubcategories)

    

router.get('/productpage',authenticateJWT, getProductControllers.getproductpage)


router.get('/products',authenticateJWT,getProductControllers.getproductData)
router.get('/index',getControllerHome.getproductDataIn)


router.delete("/deletecart/:id",getCartControllers.deleteCart);



router.post('/update-cart/:cartId', getCartControllers.updateCart);

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



  router.post('/products',getProductControllers.getproductData)
 router.post('/checkout',authenticateJWT, getPaymentway.Address)
  
module.exports = router;
