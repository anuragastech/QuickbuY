const personal=require('../../models/user/mongodb')
const cart=require('../../models/user/cart');
const Checkout=require('../../models/user/checkout')
const coupen=require('../../models/admin/coupen')
const order =require('../../models/user/order')
// const Razorpay = require('razorpay');
const Product =require('../../models/vender/productAdd');
const mongoose = require("mongoose");


// const razorpay = new Razorpay({
//   key_id: 'rzp_test_uF6rcT6FvcQis8',
//   key_secret: 'Pja8iuhLQVUicncsSVHOm2v5',
// });


let postAddress = async (req, res) => {
    try {
        const { address, phone, country, city, state, pin } = req.body;
        const userId = req.user.id;

        const currentUser = await personal.findById(userId);
        currentUser.personalInfo.push({ address, number: phone, country, state, city, pincode: pin });

        await currentUser.save();

        res.redirect('/user/check-out');
        } catch (error) {
        console.error('Error saving address:', error);
        res.status(500).json({ message: 'Failed to save address' });
    }
};





const getAddress = async (req, res) => {
    try {
        const userId = req.user.id; 
        const currentUser = await personal.findById(userId);

        
        // const data = await Checkout.find({ userId }) 
        const data = await Checkout.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } }, 
            { $unwind: "$products" },
            { 
                $lookup: {
                    from: 'products', 
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            { $unwind: "$productData" }, 
            { 
                $group: {
                    _id: "$products.productId",
                    products: { $push: "$products" },
                    productData: { $first: "$productData" }
                }
            }
        ]);
        // const total = await Checkout({ discountedAmount });  
            //  console.log(total);
// console.log(data);
        const addressInfo = currentUser.personalInfo;

        res.render('user/check-out', { addressInfo, data });
        // console.log(data);
    } catch (error) {
        console.error('Error showing data:', error);
        res.status(500).send('Internal Server Error');
    }
};


const postCarttocheckout = async (req, res) => {
    try {
        const { selectedItems } = req.body;
        const userId = req.user.id;
        const productArr = [];

        for (const id of selectedItems) {
            const productss = await cart.findOne({ products: { $elemMatch: { productId: id } } });

            if (productss) {
                const product = productss.products.find(product => product.productId == id);
                if (product) {
                    productArr.push(product);
                } else {
                    console.log("Product not found.");
                }
            } else {
                console.log("Cart not found ");
            }
        }

        const newCheckout = new Checkout({ products: productArr, userId: userId });
        await newCheckout.save();

        // Redirect the user to the checkout page after successful addition
        res.redirect('/user/check-out');
    } catch (error) {
        console.error('Error transferring items to checkout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





const coupencheck = async (req, res) => {
    const { couponCode, grandTotal } = req.body; 
    // Validate userId, assuming it's coming from req.user
    const userId = req.user.id; 

    try {
        const existingCheckout = await Checkout.findOne({ userId }); 
        // console.log(existingCheckout);


        if (existingCheckout && existingCheckout.appliedCouponCode && existingCheckout.appliedCouponCode === couponCode) {
            return res.status(400).json({ error: 'Coupon already applied to this checkout' });
        }

        const coupons = await coupen.findOne({ couponCode }); 

        if (!coupons) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        const discountPercentage = coupons.discountPercentage;

        const discountedAmount = grandTotal * (1 - discountPercentage / 100);

        if (existingCheckout) {
            existingCheckout.appliedCouponCode = couponCode;
            existingCheckout.discountedAmount = discountedAmount;
            await existingCheckout.save();
        } else {
            await Checkout.create({
                userId,
                appliedCouponCode: couponCode,
                discountedAmount
            });
        }
// console.log("Amt",discountedAmount);
        res.json({ discountedAmount });
    } catch (error) {
        console.error('Error applying coupon:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





    const orderPost = async (req, res) => {
        try {
            const userId = req.user.id;

            const { address, paymentMethod } = req.body;

            const checkoutData = await Checkout.find({ userId });

            const products = checkoutData.map(order => order.products).flat();
            const productId = products.map(product => product.productId);
    const sizes=products.map(product=>product.size)
    const quantity=products.map(product=>product.quantity)
    // console.log(quantity);
    const orders=[]
    const orderid={
    product:productId,
    size:sizes,
    quantity:quantity ,
    address:address,
    }
    orders.push(orderid);

  
    const unwoundOrders = orders.map(orderDetails => {
        const numProducts = orderDetails.product.length;
        return Array.from({ length: numProducts }, (_, i) => ({
            product: orderDetails.product[i],
            size: orderDetails.size[i],
            quantity: orderDetails.quantity[i],
            address: orderDetails.address
        }));
    }).flat();
    
    // const unwoundOrders.save()/
    
    // Now unwoundOrders array contains all orders saved based on their index
    

    // console.log(orderDetails.product[i]);
    const savePromises = unwoundOrders.map(async (orderDetails) => {
        const { product, size, quantity, address } = orderDetails;
        console.log("hi",size);

        // Create a new order object
        const newOrder = new order({
            product,
            size,
            quantity,
            address,
        });

        // Save the order and return the promise
        return newOrder.save();
    });

    // console.log("hai",unwoundOrders);

            res.status(200).json({ message: 'Order(s) placed successfully' });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };


// // Function to generate a unique order ID
// function generateOrderId() {
//     // Generate a unique ID using a suitable method (e.g., UUID, timestamp + random characters)
//     // Return the generated ID
// }

const cartProductSelected = async () =>{
  
}
module.exports={postAddress ,getAddress,postCarttocheckout,coupencheck ,orderPost, cartProductSelected};
