const Cart =require('../../models/user/cart')
const product=require('../../models/vender/productAdd')
const subcategory=require('../../models/admin/subcategory');
const mongoose = require('mongoose');
const cart = require('../../models/user/cart');
const { log } = require('handlebars');





let deleteCart = async (req, res) => {
    try {
        // const userId = req.user.id;
        // console.log(userId," kk")
        const productIdToDelete = req.params.id; 
        console.log(productIdToDelete,"zzz");
    
 
        const cart = await Cart.findOneAndUpdate(
            { "products._id": productIdToDelete },
            { $pull: { products: { _id: productIdToDelete } } },
            { new: true } 
        );

        if (!cart) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting product from cart",error:error.message});
    }
};

const updateCart = async (req, res) => {
    try {
        const cartId = req.params.cartId; 
        const newQuantity = req.body.quantity;
        const userId = req.user.id;
        const size = req.body.size;

        console.log(size, "size"); 
        console.log(cartId, newQuantity, "cartId, newQuantity"); 

        await Cart.updateOne(
            { userId: userId, "products.productId": cartId, "products.size": size }, 
            { $set: { "products.$.quantity": newQuantity } } 
        );

        res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    updateCart
};



  
let  getcartpage=async (req, res) => {
    try {

        const products = await product.find().populate('category').populate('subcategory');
        
        res.render('/cart', { products });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


// let postcart = async (req, res) => {
//     try {
//         const { productId, size, quantity } = req.body;
//         const userId = req.user.id;

//         if (!productId || !size || !quantity) {
//             return res.status(400).json({ alert: 'Product ID, size, and quantity are required' });
//         }

//         let cart = await Cart.findOne({ userId });

//         if (!cart) {
//             const newCart = new Cart({
//                 userId: userId,
//                 products: [{ productId: productId, size: size, quantity: quantity }]
//             });
//             await newCart.save();
//         } 
//         else {
//                 if (cart.products) {
//                     let existingProduct = await Cart.findOne({
//                         "products.productId": productId,
//                         "products.size": size
//                     });
//                     // console.log(existingProduct);
//                 if (existingProduct) {
//                     await Cart.updateOne(
//                         { userId: userId, "products.productId": productId, "products.size": size },
//                         { $inc: { "products.$.quantity": quantity } }
//                     );
//                 } else {
//                     cart.products.push({ productId: productId, size: size, quantity: quantity });
//                     await cart.save();
//                 }
//             } else {
//                 cart.products = [{ productId: productId, size: size, quantity: quantity }];
//                 await cart.save();
//             }
//         }

//         return res.redirect('/shopping-cart');
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };




let postcart = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || !size || !quantity) {
            return res.status(400).json({ alert: 'Product ID, size, and quantity are required' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            const newCart = new Cart({
                userId: userId,
                products: [{ productId: productId, size: size, quantity: quantity }]
            });
            await newCart.save();
        } 
        else {
                if (cart.products) {
                    let existingProduct = await Cart.findOne({
                        "products.productId": productId,
                        "products.size": size
                    });
                    // console.log(existingProduct);
                if (existingProduct) {
                    return res.status(400).json({ alert: 'Product already added' });
                } else {
                    cart.products.push({ productId: productId, size: size, quantity: quantity });
                    await cart.save();
                }
            } else {
                cart.products = [{ productId: productId, size: size, quantity: quantity }];
                await cart.save();
            }
        }

        return res.redirect('/shopping-cart');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




let getshoppingcart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Corrected line

            { $unwind: "$products" }, // Deconstruct the products array
            { 
                $lookup: {
                    from: 'products', // Name of the collection to join
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            { $unwind: "$productData" }, // Deconstruct the productData array
                { 
                    $group: {
                        _id: { productId: "$products.productId", size: "$products.size" },
                        productId:{$first: "$products.productId"},
                cart: { $first: "$products._id" },
                                                quantity: { $sum: "$products.quantity" },
                        products: { $push: "$products" },
                        productData: { $first: "$productData" }
                    }
            }
        ]);
        console.log(cart,"hell")
        cart.forEach(item => {
            item.products.forEach(product => {
                console.log("Size:", product.size);

            });
        });

// console.log(cart.products ,"jo")
        // console.log(cart , "hell");
        res.render('user/shopping-cart', { cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


// const gotocarts =async (req, res) => {
//     try {

//       const {productID,size}=req.body
// console.log(size,productID,"gooo");
// const matchData =await cart.find({size,productID})

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// };

const gotocarts = async (req, res) => {
    try {
        const { productID, size } = req.body;
        const userId = req.user.id;
        console.log(userId,"user");

        const matchData = await Cart.find({ userId: userId, "products.size": size});
        // const matchData = await Cart.find({ userId: userId, "products.size": size, "products.productId": productID });
        console.log(matchData, "matchdata");

        if (matchData.length > 0) {
            res.status(200).json({ success: true, available: true });
        } else {
            res.status(200).json({ success: true, available: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports={ updateCart, deleteCart,getcartpage,postcart,getshoppingcart,gotocarts}  
