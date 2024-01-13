const Cart =require('../../models/user/cart')


getcartlist= async (req, res) => {
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
};
getcartpage=async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        
        res.render('user/cart', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
postcart= async (req, res) => {
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
};
getshoppingcart=(req,res)=>{
    const token = req.cookies.token;
    
    if(token){
        res.render('user/shopping-cart')
    }
    else{
        return res.redirect('/user/login');
    }
    };
module.exports={getcartlist,getcartpage,postcart,getshoppingcart}
