const personal=require('../../models/user/mongodb')
const cart=require('../../models/user/cart');
const Checkout=require('../../models/user/checkout')
const coupen=require('../../models/admin/coupen')
const order =require('../../models/user/order')
const Razorpay = require('razorpay');
const Product =require('../../models/vender/productAdd');
const mongoose = require("mongoose");
// const { checkout } = require('../../routes/vender');
const schedule = require('node-schedule');

const razorpay = new Razorpay({
  key_id: 'rzp_test_uF6rcT6FvcQis8',
  key_secret: 'Pja8iuhLQVUicncsSVHOm2v5',
});


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
        // Schedule a job to clear old checkout documents every 2 minutes
     

        const clearOldCheckouts = async () => {
            try {
                const twoMinutesAgo = new Date(Date.now() - (1 * 10 * 1000)); // Calculate 2 minutes ago
                await Checkout.deleteMany({ createdAt: { $lt: twoMinutesAgo } });
                console.log('Old checkout documents cleared.');
            } catch (error) {
                console.error('Error clearing old checkout documents:', error);
            }
        };

        // Schedule the job to clear old checkout documents
        const clearCheckoutJob = schedule.scheduleJob('*/2 * * * *', clearOldCheckouts);
// console.log(clearCheckoutJob);
        // Redirect the user to the checkout page after successful addition
        res.redirect('/user/check-out');
    } catch (error) {
        console.error('Error transferring items to checkout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





const coupencheck = async (req, res) => {
    const { couponCode, grandTotal } = req.body; 
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
// console.log(req.body);
            const checkoutData = await Checkout.find({ userId });

            const products = checkoutData.map(order => order.products).flat();
            const productId = products.map(product => product.productId);
    const sizes=products.map(product=>product.size)
    const quantity=products.map(product=>product.quantity)
    const price=checkoutData.map(price=>price.discountedAmount);
    console.log("price",price);
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
            address: orderDetails.address,
          
        }));
    }).flat();
    
  
    // console.log(orderDetails.product[i]);
    const savePromises = unwoundOrders.map(async (orderDetails) => {
        const { product, size, quantity, address  } = orderDetails;
        // console.log("hi",size);

        // Create a new order object
        const newOrder = new order({
            product,
            size,
            quantity,
            address,
        
        });

        return newOrder.save();
    });
console.log("price",price);


    let paymentResponse;
    if (paymentMethod === 'cash') {
        await cart.deleteMany({ userId, product: { $in: productId } });
        paymentResponse = { message: 'Order placed successfully with Cash on Delivery' };
    } else if (paymentMethod === 'online') {
        const razorpayOrder =  await razorpay.orders.create({
            amount: price*100,
            currency: 'INR',
            receipt: 'order_rcptid_11', // Replace with your receipt ID
            payment_capture: 1
        });

        // Send the Razorpay order ID back to the client-side for payment processing
        paymentResponse = { message: 'Order placed successfully with Razorpay', razorpayOrder };
    } else {
        throw new Error('Invalid payment method');
    }

    // Send payment response back to the client
    res.status(200).json(paymentResponse);
} catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
}
};




const cartProductSelected = async () =>{
  
}



module.exports={postAddress ,getAddress,postCarttocheckout,coupencheck ,orderPost, cartProductSelected};
