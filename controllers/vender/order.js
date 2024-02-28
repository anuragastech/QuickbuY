const order = require('../../models/user/order');

const orderlist = async (req, res) => {
    try {
        const orderlists = await order.find({});
        console.log(orderlists);
        return res.render('vender/orderDetails', { orderlists });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {orderlist};
