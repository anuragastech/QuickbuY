const product=require('../../models/vender/productAdd')


let getproductpage =async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        // console.log(products); // Add this line
        res.render('user/productpage', { data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
let getproductData= async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        res.render('user/product', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

let productpass = async (req, res) => {
    try {
        console.log("try");
        const { id: productId } = req.params;
        console.log(productId);
        const productData = await product.findById({ _id: ObjectId (productId)});
        console.log(productData);

        if (productData) {
            res.status(200).render('user/productpage', { productData });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
let productpage =(req,res)=>{
    res.render('user/productpage')};


module.exports= {getproductpage,getproductData,productpass,productpage}