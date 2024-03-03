 const orders=require("../../models/user/order")


const order=async(req,res)=>{

const orderData = await orders.find()
// console.log(orderData);
    res.render('admin/orderList',{orderData})

}

const shippingStatus = async (req, res) => {
    const { id, status } = req.body;

    try {
        // Update the shipping status of the order
        const updatedOrder = await orders.findOneAndUpdate(
            { _id: id },
            { shippingStatus: status },
            { new: true } 
        );

        console.log(updatedOrder);

        res.status(200).json({ message: 'Shipping status updated successfully', order: updatedOrder });
    } catch (error) {

        console.error('Error updating shipping status:', error);
        res.status(500).json({ error: 'An error occurred while updating shipping status' });
    }
}

const orderStatus= async (req, res) => {
    const { id, status } = req.body;
    console.log(req.body);

    try {
        // Update the shipping status of the order
        const updatedOrder = await orders.findOneAndUpdate(
            { _id: id },
            { orderAccepted: status },
            { new: true } 
        );

        console.log(updatedOrder);

        res.status(200).json({ message: 'Shipping status updated successfully', order: updatedOrder });
    } catch (error) {

        console.error('Error updating shipping status:', error);
        res.status(500).json({ error: 'An error occurred while updating shipping status' });
    }
}




module.exports={order,shippingStatus,orderStatus}