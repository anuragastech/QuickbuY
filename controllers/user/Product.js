const product=require('../../models/vender/productAdd')


getproductpage=async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        // console.log(products); // Add this line
        res.render('user/productpage', { data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
getproductData= async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        res.render('user/product', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

productpass = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const productData = await product.findById(productId);
        console.log(productData);

        if (productData) {
            res.status(200).render('user/productpage', { data: productData });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports={getproductpage,getproductData,productpass}