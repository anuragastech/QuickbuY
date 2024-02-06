const Cart =require('../../models/user/cart')
const product=require('../../models/vender/productAdd')
const subcategory=require('../../models/admin/subcategory');
const cart = require('../../models/user/cart');



let deleteCart = async (req, res) => {
    try {
        const cartId = req.params.id; 
        const deletedCart = await Cart.findByIdAndDelete(cartId);
        
        if (!deletedCart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting cart data", error: error.message });
    }
};



// getcartlist= async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const cart = await Cart.aggregate([
//             {
//                 $match: {
//                     userId: mongoose.Types.ObjectId(userId),
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'products',  
//                     localField: 'product',
//                     foreignField: '_id',
//                     as: 'productDetails',
//                 },
//             },
//             {
//                 $unwind: '$productDetails',
//             },
//             {
//                 $project: {
//                     'productDetails.productName': 1,
//                     // Include other fields from Cart if needed
//                 },
//             },
//         ]);
//         res.render('user/cartlist', { cart });
//         console.log('cart');

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }

// };

const updateCart = async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const newQuantity = req.body.quantity;
  
      await Cart.findByIdAndUpdate(cartId, { quantity: newQuantity }, { new: true });
  
      res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
let  getcartpage=async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        
        res.render('user/cart', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

let postcart = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const userId = req.user.id;
        // console.log(yes);

        console.log(userId);

        if (!productId) {
            return res.status(400).json({ alert: 'Product ID is required' });
        }

        const existingCartItem = await Cart.findOne({ product: productId });

        if (existingCartItem) {
            return res.status(400).json({ message: 'Product already in the cart' });
        }

        const newCartItem = new Cart({
            product: productId,
            userId: userId,
            size: size,
            quantity: quantity,
        });

        await newCartItem.save();
        
        // Redirect should be done using res.redirect, not res.rendirect
        return res.redirect('/user/shopping-cart');

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


let  getshoppingcart =  async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.find({ userId: userId })
            .populate({
                path: 'product',
                populate: [{ path: 'category' }, { path: 'subcategory' }],
            });
        //   console.log("test",cart);
        res.render('user/shopping-cart', { cart });
        // console.log('cart');

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports={ updateCart, deleteCart,getcartpage,postcart,getshoppingcart}
