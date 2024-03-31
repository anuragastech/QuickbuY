
const order =require("../../models/user/order")

const orderGet = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = 10; // Number of items per page

        const totalOrders = await order.countDocuments({ userId: userId });
        const totalPages = Math.ceil(totalOrders / limit);
        const skip = (page - 1) * limit;

        const orders = await order.find({ userId: userId })
                                  .populate('product')
                                  .skip(skip)
                                  .limit(limit);

        // Pagination details
        const pagination = {
            prev: page > 1 ? `?page=${page - 1}` : null,
            next: page < totalPages ? `?page=${page + 1}` : null,
            pages: []
        };

        // Create pagination page numbers
        for (let i = 1; i <= totalPages; i++) {
            pagination.pages.push({
                number: i,
                url: `?page=${i}`,
                active: i === page
            });
        }

        res.render('user/OrderDetails', { orders, pagination });
    } catch (error) {
        console.error('Error related to order status:', error);
        res.status(500).json({ error: 'An related to ordered error status' });
    }
};


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