
const order =require("../../models/user/order")

const orderGet=async (req,res)=>{

    try{
        const {orderId}=req.body;
        // console.log(orderId,"mnfnmf");
        const userId=req.user.id

// console.log(userId);
const orders = await order.find({ userId: userId }).populate('product');

    res.render('user/OrderDetails',{orders})
    }
    catch (error){
        console.error('Error related to order status:', error);
        res.status(500).json({ error: 'An related to ordered error status' });
    }
}


const PostOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        // console.log(orderId, "orderId");
// console.log("mvrnjvr4t");
        // Assuming you have a method to fetch order details by ID from your database
        const orderDetails = await order.findById(orderId);
console.log(orderDetails,"mfkefmf3rmki");
        // Send the order details to the frontend
        res.json({ orderDetails });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'An error occurred while fetching order details' });
    }
}






module.exports={orderGet,PostOrder}