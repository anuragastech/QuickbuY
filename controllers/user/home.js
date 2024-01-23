
const product =require('../../models/vender/productAdd')
const category=require('../../models/admin/category')
const Homepagepic=require('../../models/admin/Homepagebar')






let getproductDataIn= async (req, res) => {
    try {

        const categorys=await category.find({}, 'id title description image');
        const prdct = await product.find().populate('category').populate('subcategory');

        const homebanner=await Homepagepic.find({}, 'h1 h2 image');

        res.render('user/index', { prdct ,categorys ,homebanner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



module.exports={getproductDataIn};