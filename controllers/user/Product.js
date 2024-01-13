const product=require('../../models/admin/productAdd')


getproductpage=async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        console.log(products); // Add this line
        res.render('user/productpage', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
getproductdetails= async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        res.render('user/productdetails', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports={getproductpage,getproductdetails}