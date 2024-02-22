const Cart =require('../../models/user/cart')
const product=require('../../models/vender/productAdd')
const subcategory=require('../../models/admin/subcategory');
const mongoose = require('mongoose');

let deleteCart = async (req, res) => {
    try {
        const cartId = req.params.id;

        const deletedProduct = await Cart.updateOne(
      
            { $pull: { products: { productId: cartId} } }
        );

        // console.log(cartId  );
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting product from cart", error: error.message });
    }
};





const updateCart = async (req, res) => {
    try {

        const userId = req.user.id;
        // console.log( "user", userId);
      const productId= req.params.cartId;
    //   console.log(productId);
      const newQuantity = req.body.quantity;
    //   console.log(newQuantity)


    const updatedCart = await Cart.findOneAndUpdate(
        { userId, "products.productId": productId }, 
        { $set: { "products.$.quantity": newQuantity } }, 
        { new: true }
    );

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
        } else {
                if (cart.products) {
                    let existingProduct = await Cart.findOne({
                        "products.productId": productId,
                        "products.size": size
                    });
                    // console.log(existingProduct);
                if (existingProduct) {
                    await Cart.updateOne(
                        { userId: userId, "products.productId": productId, "products.size": size },
                        { $inc: { "products.$.quantity": quantity } }
                    );
                } else {
                    cart.products.push({ productId: productId, size: size, quantity: quantity });
                    await cart.save();
                }
            } else {
                cart.products = [{ productId: productId, size: size, quantity: quantity }];
                await cart.save();
            }
        }

        return res.redirect('/user/shopping-cart');
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
                    _id: "$products.productId",
                    products: { $push: "$products" },
                    productData: { $first: "$productData" }
                }
            }
        ]);
        cart.forEach(item => {
            item.products.forEach(product => {
                // console.log("Size:", product.size);

            });
        });

        // console.log(cart);
        res.render('user/shopping-cart', { cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



module.exports={ updateCart, deleteCart,getcartpage,postcart,getshoppingcart}
