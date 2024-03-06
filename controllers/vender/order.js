const order = require('../../models/user/order');

const orderlist = async (req, res) => {
    try {
        venderId=req.user.id;
        // console.log(venderId);


        const orderlists = await order.find({ venderId: venderId });
        console.log(orderlists);
        return res.render('vender/orderDetails',{orderlists});
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

const shippingStatus = async (req, res) => {
    const { id, status } = req.body;

    try {
        // Update the shipping status of the order
        const updatedOrder = await order.findOneAndUpdate(
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
        const updatedOrder = await order.findOneAndUpdate(
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



module.exports = {orderlist,orderStatus,shippingStatus};
