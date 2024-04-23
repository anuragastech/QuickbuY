const personal=require('../../models/user/mongodb')
const cart=require('../../models/user/cart');
const Checkout=require('../../models/user/checkout')
const coupen=require('../../models/admin/coupen')
const order =require('../../models/user/order')
const Razorpay = require('razorpay');
const Product =require('../../models/vender/productAdd');
const mongoose = require("mongoose");
const schedule = require('node-schedule');
const productAdd=require('../../models/vender/productAdd')

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

        res.redirect('/check-out');
        } catch (error) {
        console.error('Error saving address:', error);
        res.status(500).json({ message: 'Failed to save address' });
    }
};





const deleteAddress= async (req,res) =>{
    const addressId= req.params.Id;
console.log("hellofdwifgwnm");
console.log(addressId);
    
}




const getAddress = async (req, res) => {
    try {
        const userId = req.user.id; 
        const currentUser = await personal.findById(userId);
        
        const data = await cart.aggregate([
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
        // cart.forEach(item => {
        //     item.products.forEach(product => {
        //         // console.log("Size:", product.size);

        //     });
        // });

console.log(data,"lsls");

        const addressInfo = currentUser.personalInfo;

        res.render('user/check-out', { addressInfo, data });
    } catch (error) {
        console.error('Error showing data:', error);
        res.status(500).send('Internal Server Error');
    }
};



// const postCarttocheckout = async (req, res) => {
//     try {
//         const { selectedItems } = req.body;
//         const userId = req.user.id;
//         const productArr = [];

//         for (const id of selectedItems) {
//             const productss = await cart.findOne({ products: { $elemMatch: { productId: id } } });

//             if (productss) {
//                 const product = productss.products.find(product => product.productId == id);
//                 if (product) {
//                     productArr.push(product);
//                 } else {
//                     console.log("Product not found.");
//                 }
//             } else {
//                 console.log("Cart not found ");
//             }
//         }

//         const newCheckout = new Checkout({ products: productArr, userId: userId });
//         await newCheckout.save();
//         // console.log("ch",newCheckout);
//         // Schedule a job to clear old checkout documents every 2 minutes
     

//         const clearOldCheckouts = async () => {
//             try {
//                 const twoMinutesAgo = new Date(Date.now() - (1 * 10 * 1000)); // Calculate 2 minutes ago
//                 await Checkout.deleteMany({ createdAt: { $lt: twoMinutesAgo } });
//                 // console.log('Old checkout documents cleared.');
//             } catch (error) {
//                 console.error('Error clearing old checkout documents:', error);
//             }
//         };

//         // Schedule the job to clear old checkout documents
//         const clearCheckoutJob = schedule.scheduleJob('*/2 * * * *', clearOldCheckouts);
// // console.log(clearCheckoutJob);
//         // Redirect the user to the checkout page after successful addition
//         res.redirect('/check-out');
//     } catch (error) {
//         console.error('Error transferring items to checkout:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };






// const postCarttocheckout = async (req, res) => {
//     try {
//         const { selectedItems } = req.body;
//         console.log(selectedItems,"nonon");
//         const userId = req.user.id;
//         const productArr = [];

//         for (const id of selectedItems) {
//             const productss = await cart.findOne({ products: { $elemMatch: { productId: id } } });

//             if (productss) {
//                 const product = productss.products.find(product => product.productId == id);
//                 if (product) {
//                     // Check if a product with the same ID and size already exists in productArr
//                     const existingProductIndex = productArr.findIndex(p => p.productId === id && p.size === product.size);
//                     if (existingProductIndex === -1) {
//                         // If no existing product with the same ID and size, push the product to productArr
//                         productArr.push(product);
//                     } else {
//                         // If an existing product with the same ID and size exists, create a new document
//                         const newCheckout = new Checkout({ products: [product], userId: userId });
//                         await newCheckout.save();
//                     }
//                 } else {
//                     console.log("Product not found.");
//                 }
//             } else {
//                 console.log("Cart not found ");
//             }
//         }

//         // If there are products with the same ID and different sizes, they will already be saved as new documents.
//         // Now, delete the existing checkout document for the user
//         await Checkout.deleteOne({ userId: userId });

//         // If there are still products left in productArr, create a new checkout document with the updated products
//         if (productArr.length > 0) {
//             const newCheckout = new Checkout({ products: productArr, userId: userId });
//             await newCheckout.save();
//         }

//         // Redirect the user to the checkout page after successful addition
//         res.redirect('/check-out');
//     } catch (error) {
//         console.error('Error transferring items to checkout:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };



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
        res.json({ discountedAmount });
    } catch (error) {
        console.error('Error applying coupon:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};







//     const orderPost = async (req, res) => {
//         try {
//             const userId = req.user.id;

//             const { address, paymentMethod ,grandTotal} = req.body;
//             // console.log("enthaada",grandTotal,paymentMethod);
// // console.log(req.body);
//             const checkoutData = await Checkout.find({ userId });

//             const products = checkoutData.map(order => order.products).flat();
//             const productId = products.map(product => product.productId);
//     const sizes=products.map(product=>product.size)
//     const quantity=products.map(product=>product.quantity)

// let prices;

// // Check if there are any items with discounted prices in checkoutData
// const discountedPrices = checkoutData.filter(item => item.discountedAmount !== undefined && item.discountedAmount !== null);

// if (discountedPrices.length > 0) {
//     // If there are discounted prices, use the first one
//     prices = discountedPrices[0].discountedAmount;
// } else {
//     // If there are no discounted prices, use the grand total
//     prices = grandTotal;
// }



// console.log("hahali",prices);

//     // console.log(quantity);
//     const orders=[]

// // console.log("hell",productId);

// const productresult = await Product.aggregate([
//     {
//         $match: {
//             _id: { $in: productId } 
//         }
//     },
//     {
//         $lookup: {
//             from: 'products',
//             localField: 'product',
//             foreignField: '_id', 
//             as: 'productDetails' 
//         }
//     }
// ]);
// const color=productresult.map(l=>l.color)
// const productname=productresult.map(l=>l.productname)
// const brand=productresult.map(l=>l.brand)
// const category=productresult.map(l=>l.categoryName)
// const subcategory=productresult.map(l=>l.subcategoryName)
// const venderId=productresult.map(l=>l.venderId)

// // console.log("hi",color,productname,brand,category,subcategory);
// // -----  
// const orderid={
//     product:productId,
//     size:sizes,
//     quantity:quantity ,
//     address:address,
//    color:color,
//    productname:productname,
//    brand:brand,
//    category:category,
//    subcategory:subcategory,
//    venderId:venderId,
 
//     }
//     // console.log("hell0", orderid);
//     orders.push(orderid);

// //   console.log("orders",orders);
//     const unwoundOrders = orders.map(orderDetails => {
//         const numProducts = orderDetails.product.length;
//         return Array.from({ length: numProducts }, (_, i) => ({
//             product: orderDetails.product[i],
//             size: orderDetails.size[i],
//             quantity: orderDetails.quantity[i],
//             address: orderDetails.address,
//             color:orderDetails.color[i],
//             productname:orderDetails.productname[i],
//             brand:orderDetails.brand[i],
//             venderId:orderDetails.venderId[i],

//             category:orderDetails.category[i],

//             subcategory:orderDetails.subcategory[i],


          
//         }));
//     }).flat();
    
// //   console.log(unwoundOrders);
//     // console.log(orderDetails.product[i]);
//     const savePromises = unwoundOrders.map(async (orderDetails) => {
//         const { product, size, quantity, address,color,productname,brand ,category,subcategory ,venderId} = orderDetails;
//         // console.log("price",paymentMethod);

//         // console.log(venderId,address);

//         // console.log(productscolor);
// // console.log(product);
//         // Create a new order object
//         const newOrder = new order({
//             product,
//             size,
//             quantity,
//             address,
//             price:prices,
//             color,
//             productname,
//             brand,
//             category,
//             subcategory,
//             venderId:venderId,
//             paymentMethod:paymentMethod,
//             paymentStatus:'success',
//             shippingStatus:'processing',
//             orderAccepted:'pending',
//             userId:userId,

        
//         });

//         return newOrder.save();
       
//     });
// console.log(prices,'prices');
//     // console.log("rare",prices);
// // console.log(paymentMethod);
//     let paymentResponse;
//     if (paymentMethod === 'cash') {
//         // For cash on delivery
//         paymentResponse = { message: 'Order placed successfully with Cash on Delivery' };
       

//     } else if (paymentMethod === 'online') {
//         const razorpayOrder =  await razorpay.orders.create({
//             amount: prices*100,
//             currency: 'INR',
//             receipt: 'order_rcptid_11', // Replace with your receipt ID
//             payment_capture: 1
//         });
//      // Reduce product quantities
//     //  await Promise.all(unwoundOrders.map(async (orderDetails) => {
//     //     const { product, quantity } = orderDetails;
//     //     const x=orderDetails.product
//     //     // const UpdateOrderedDAta=await productAdd.find({_id:x})
//     //     console.log(x,"dstaahgdgywwgh");
    
// // Extract product IDs and quantities from unwoundOrders
// const productsToUpdate = unwoundOrders.map(orderDetails => ({
//     productId: orderDetails.product,
//     size: orderDetails.size, // Assuming orderDetails contains the size of the product
//     quantity: orderDetails.quantity
// }));

// const updateOperations = productsToUpdate.map(({ productId, size, quantity }) => ({
//     updateOne: {
//         filter: { _id: productId, 'properties.size': size }, // Filter to find the product by its ID and size
//         update: { $inc: { 'properties.$.quantity': -quantity } } // Decrement the quantity for the specific size
//     }
// }));

// // Execute update operations in parallel
// await Promise.all(updateOperations.map(op => productAdd.updateOne(op)));

// console.log('Quantities updated successfully.');
//         // const existingProduct = await Product.findById(product);
//         // if (existingProduct) {
//         //     existingProduct.quantity -= quantity;
//         //     await existingProduct.save();
//         // }
//     // }));
//         // Send the Razorpay order ID back to the client-side for payment processing
//         paymentResponse = { message: 'Order placed successfully with Razorpay', razorpayOrder };
//     } else {
//         throw new Error('Invalid payment method');
//     }

//     // Send payment response back to the client
//     res.status(200).json(paymentResponse);
// } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: 'Internal server error' });
// }
// };




const orderPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { address, paymentMethod, grandTotal } = req.body;
console.log(paymentMethod,"hh");
        // Fetch cart data for the user
        const cartData = await cart.findOne({ userId });

        if (!cartData) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        const products = cartData.products;
        const productId = products.map(product => product.productId);
        const sizes = products.map(product => product.size);
        const quantity = products.map(product => product.quantity);

        let prices;

        // Check if there are any items with discounted prices in cartData
        const discountedPrices = cartData.products.filter(item => item.discountedAmount !== undefined && item.discountedAmount !== null);

        if (discountedPrices.length > 0) {
            // If there are discounted prices, use the first one
            prices = discountedPrices[0].discountedAmount;
        } else {
            // If there are no discounted prices, use the grand total
            prices = grandTotal;
        }

        const orders = [];

        const productresult = await Product.aggregate([
            {
                $match: {
                    _id: { $in: productId }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            }
        ]);

        const color = productresult.map(l => l.color);
        const productname = productresult.map(l => l.productname);
        const brand = productresult.map(l => l.brand);
        const category = productresult.map(l => l.categoryName);
        const subcategory = productresult.map(l => l.subcategoryName);
        const venderId = productresult.map(l => l.venderId);

        const orderid = {
            product: productId,
            size: sizes,
            quantity: quantity,
            address: address,
            color: color,
            productname: productname,
            brand: brand,
            category: category,
            subcategory: subcategory,
            venderId: venderId,
        };

        orders.push(orderid);

        const unwoundOrders = orders.map(orderDetails => {
            const numProducts = orderDetails.product.length;
            return Array.from({ length: numProducts }, (_, i) => ({
                product: orderDetails.product[i],
                size: orderDetails.size[i],
                quantity: orderDetails.quantity[i],
                address: orderDetails.address,
                color: orderDetails.color[i],
                productname: orderDetails.productname[i],
                brand: orderDetails.brand[i],
                venderId: orderDetails.venderId[i],
                category: orderDetails.category[i],
                subcategory: orderDetails.subcategory[i],
            }));
        }).flat();





        // Create orders in the database
        const savePromises = unwoundOrders.map(async (orderDetails) => {
            const { product, size, quantity, address, color, productname, brand, category, subcategory, venderId } = orderDetails;

            const newOrder = new order({
                product,
                size,
                quantity,
                address,
                price: prices,
                color,
                productname,
                brand,
                category,
                subcategory,
                venderId, // Ensure venderId is included here
                                paymentMethod: paymentMethod,
                paymentStatus: 'success',
                shippingStatus: 'processing',
                orderAccepted: 'pending',
                userId: userId,
            });

            return newOrder.save();
        });

        // Integrate Razorpay payment
        if (paymentMethod === 'online') {
            const razorpayOrder = await razorpay.orders.create({
                amount: prices * 100, // Amount in paise
                currency: 'INR',
                receipt: 'order_rcptid_11', // Replace with your receipt ID
                payment_capture: 1
            });
            // Send the Razorpay order details back to the client
            return res.status(200).json({ message: 'Order placed successfully with Razorpay', razorpayOrder });
        }

        // Update product quantities and remove items from the cart after successful order creation
        for (let i = 0; i < productId.length; i++) {
            const existingProduct = await Product.findById(productId[i]);
            if (existingProduct) {
                existingProduct.quantity -= quantity[i];
                await existingProduct.save();
            }
        }



        
        // Remove items from the cart after successful order creation
        await cart.updateOne({ userId }, { $pull: { products: { productId: { $in: productId } } } });
        // Send payment response back to the client
        let paymentResponse;
        if (paymentMethod === 'cash') {
            // For cash on delivery
            paymentResponse = { message: 'Order placed successfully with Cash on Delivery' };
        } else {
            paymentResponse = { message: 'Order placed successfully' }; // Or any other response you want
        }

        res.status(200).json(paymentResponse);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const cartProductSelected = async () =>{
  
}






module.exports={postAddress ,getAddress,coupencheck ,orderPost, cartProductSelected,deleteAddress};