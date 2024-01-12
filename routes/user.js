const express = require('express');
const router=express.Router();

const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken');

const create=require('../models/user/mongodb')
const category=require('../models/admin/category')
const product=require('../models/admin/productAdd');
const subcategory = require('../models/admin/subcategory');
const Cart =require('../models/user/cart')
const { authenticateJWT } = require('../middleware/authmiddleware');
const secretKey =  'mynameissomethinglikestartwithathatsit';


router.post('/sign', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const repeatPassword = req.body.repeatPassword;
        if (password !== repeatPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const myEncryptedPassword = await bcrypt.hash(password, 10);

        const newCreate = new create({
            name: username,
            email:email,
            password: myEncryptedPassword,
            role: 'user',
        });

        await newCreate.save();

        const token = jwt.sign({ id: newCreate._id, role: newCreate.role }, secretKey, { expiresIn: '2h' });

        newCreate.token = token;
        // newUser.password = undefined;

        await newCreate.save();

        const options = {
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie('token', token, options);

        res.redirect('login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// *********************************************************************************************************
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await create.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log('Authentication successful');

            const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '2h' });

            user.token = token;
            await user.save();

            const options = {
                expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie('token', token, options);

            return res.redirect('index');
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// ****************************************************************************************


router.get('/sign',(req,res)=>{


res.render('user/sign');
});



router.get('/login',(req,res)=>{
res.render('user/login')
})

router.get('/index' ,authenticateJWT,(req,res)=>{


    res.render('user/index')

})

router.get('/login', (req, res) => {
    const token = req.cookies.token;

    if (token) {
        return res.redirect('/admin/home');
    }

    return res.render('admin/login');
});



// router.get('/productpage',(req,res)=>{



// const token = req.cookies.token;

// if(token){
//     res.render('user/productpage')
// }
// else{
//     return res.redirect('/user/login');
// }


// })


router.get('/categories',(req,res)=>{

const token = req.cookies.token;

if(token){
    res.render('user/categories')
}
else{
    return res.redirect('/user/login');
}
});



// Logout route
router.get("/logout", (req, res) => {
    res.clearCookie("token");

    res.redirect("/user/login");
});




router.get('/check-out',(req,res)=>{
res.render('user/check-out')
});
router.get('/contact',(req,res)=>{
res.render('user/contact')
});

router.get('/shopping-cart',(req,res)=>{
const token = req.cookies.token;

if(token){
    res.render('user/shopping-cart')
}
else{
    return res.redirect('/user/login');
}
});

router.get('/user',(req,res)=>{
res.render('user/user')
});



// router.get('/cart',(req,res)=>{
//     res.render('user/cart')
//     });



    router.get('/category', async (req, res) => {
        try {
            const categories = await category.find({}, 'id title description image');
            console.log(categories); // Add this line
            res.render('user/category', { categories });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    });

    router.get('/subcategories', async (req, res) => {
        try {
            const subcategories = await subcategory.find({}, 'id title description image');
            console.log(subcategories); // Add this line
            res.render('user/subcategories', { subcategories });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    });
    

router.get('/productpage', async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        console.log(products); // Add this line
        res.render('user/productpage', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



router.get('/productdetails', async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        res.render('user/productdetails', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/cart',authenticateJWT, async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        
        res.render('user/cart', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



router.get('/cartlist', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: 'products',  
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            {
                $unwind: '$productDetails',
            },
            {
                $project: {
                    'productDetails.productName': 1,
                    // Include other fields from Cart if needed
                },
            },
        ]);
        res.render('user/cartlist', { cart });
        console.log('cart');

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});




router.post('/cart/product/:id',authenticateJWT, async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;

        console.log(productId);
        if (!productId) {
            return res.status(400).json({ alert: 'Product ID is required' });
        }

        const existingCartItem = await Cart.findOne({ product: productId });

        if (existingCartItem) {
            return res.status(400).json({ message: 'Product already in the cart' });
        }

        // const userId = req.cookies.userId;

        const newCartItem = new Cart({
            product: productId,
            userId: userId,  
            
        });
       

        await newCartItem.save();
        
        res.render('user/cart');

        return res.status(200).json({ message: 'Product added to the cart successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

  
module.exports = router;