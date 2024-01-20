
const product =require('../../models/vender/productAdd')
const category=require('../../models/admin/category')




let getproductDataIn= async (req, res) => {
    try {
        const categorys=await category.find({}, 'id title description image');
        const prdct = await product.find().populate('category').populate('subcategory');
        res.render('user/index', { prdct ,categorys});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



module.exports={getproductDataIn};