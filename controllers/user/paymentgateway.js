const personal=require('../../models/user/mongodb')
const cart=require('../../models/user/cart');
const Checkout=require('../../models/user/checkout')

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



let getAddress = async (req, res) => {
    try {
        const userId = req.user.id; 
        const currentUser = await personal.findById(userId);
        const data = await Checkout.find({}).populate('product');

        const addressInfo = currentUser.personalInfo;
// console.log(addressInfo);
        res.render('user/check-out', { addressInfo ,data}); 
    } catch (error) {
        console.error('Error showing data:', error);
        res.status(500).send('Internal Server Error');
    }
};

const postCarttocheckout = async (req, res) => {
    try {
        const { selectedItems } = req.body;
        const userId = req.user.id; 

        // Fetch cart items based on selected items
        const matchcart = await cart.find({ _id: { $in: selectedItems } });
        console.log(matchcart);

        // Assuming you have productId, size, and quantity available in the request body
        for (const item of matchcart) {
            const { product, size, quantity } = item;
            const newcheckoutItem = new Checkout({
                product: product,
                userId: userId,
                size: size,
                quantity: quantity,
            });
            await newcheckoutItem.save();
        }

        // If there's no userId, clear all data from Cart and Checkout collections
        if (!userId) {
            try {
                const deleteResult = await Checkout.deleteMany({});
                console.log(`${deleteResult.deletedCount} documents deleted from Checkout collection`);
            } catch (error) {
                console.error('Error deleting documents from Checkout collection:', error);
            }
        }
        
        res.redirect('/user/check-out');

    } catch (error) {
        console.error('Error showing data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};














module.exports={postAddress ,getAddress,postCarttocheckout};
