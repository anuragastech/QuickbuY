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





router.post('/sign',userControllers.Addsign)

router.post('/login',userControllers.Addlogin)

router.get('/sign',userControllers.getsign)

router.get('/login',userControllers.getlogin)

// Logout route
router.get("/logout",userControllers.getlogout)

// router.get('/index' ,getAllControllers.getindex);
router.get('/login',getAllControllers.getlogin)
router.get('/categories',getCategoryControllers.getcategory)
router.get('/check-out',getAllControllers.getcheckout)
router.get('/contact',getAllControllers.getcontact)


router.get('/user',getAllControllers.getuser)


    router.get('/category',getCategoryControllers.getcategorys)

    router.get('/subcategories',getSubcategoryControllers.getsubcategories)
    

router.get('/productpage', getProductControllers.getproductpage)


router.get('/products',getProductControllers.getproductData)
router.get('/index',getControllerHome.getproductDataIn)





router.get('/cart',authenticateJWT, getCartControllers.getcartpage)



// router.get('/cartlist', authenticateJWT,getCartControllers.getcartlist)



router.post('/cart/product/:id',authenticateJWT,getCartControllers.postcart)
router.get('/shopping-cart',getCartControllers.getshoppingcart)

  
router.get('/cart',(req,res)=>{
    res.render('user/cart')
    });


    // router.get('/products',(req,res)=>{
    //   res.render('user/products')
    //   });
// router.get('/productpage',getProductControllers.productpage)

  // router.get('/productpage',getProductControllers.productpass)

 

 
  
module.exports = router;