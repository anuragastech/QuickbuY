
const product =require('../../models/vender/productAdd')
const category=require('../../models/admin/category')
const Homepagepic=require('../../models/admin/Homepagebar')
const HomepageFooter =require ('../../models/admin/HomepagebarFooter')
const subcategory=require('../../models/admin/subcategory')





let getproductDataIn= async (req, res) => {
    try {
        const subcategor = await subcategory.find({}, 'id title description image');

        const categorys=await category.find({}, 'id title description image');
        const prdcts = await product.find().populate('category').populate('subcategory');

        const homebanner=await Homepagepic.find({}, 'h1 h2 image');
        const Homepagepics = await HomepageFooter.find();

const prdctSliced = prdcts.slice(0, 8); //add  how much product want to show 


        res.render('user/index', {subcategor, prdct: prdctSliced  ,categorys ,homebanner , Homepagepics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports={getproductDataIn};