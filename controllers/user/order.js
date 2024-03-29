
const order =require("../../models/user/order")

const orderGet=async (req,res)=>{
    try{
        const userId=req.user.id

// console.log(userId);
        const orders= await order.find({userId:userId})
        console.log(orders);
    res.render('user/OrderDetails',{orders})
    }
    catch (error){
        console.error('Error related to order status:', error);
        res.status(500).json({ error: 'An related to ordered error status' });
    }
}






module.exports={orderGet}