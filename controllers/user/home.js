
const product =require('../../models/vender/productAdd')
const category=require('../../models/admin/category')
const Homepagepic=require('../../models/admin/Homepagebar')
const HomepageFooter =require ('../../models/admin/HomepagebarFooter')
const subcategory=require('../../models/admin/subcategory')



const getproductDataIn = async (req, res) => {
    try {
        // Check if the token cookie exists in the request 
        const token = req.cookies.token;

        if (token) {
         
            const subcategor = await subcategory.find({}, 'id title description image');
            const categorys = await category.find({}, 'id title description image');
            const prdcts = await product.find().populate('category').populate('subcategory');
            const homebanner = await Homepagepic.find({}, 'h1 h2 image');
            const Homepagepics = await HomepageFooter.find();
            const prdctSliced = prdcts.slice(0, 18); // Limit to 8 products

            // Render the home page with product data
            res.render('user/index', { subcategor, prdct: prdctSliced, categorys, homebanner, Homepagepics, loggedIn: true });
        } else {

            const subcategor = await subcategory.find({}, 'id title description image');
            const categorys = await category.find({}, 'id title description image');
            const prdcts = await product.find().populate('category').populate('subcategory');
            const homebanner = await Homepagepic.find({}, 'h1 h2 image');
            const Homepagepics = await HomepageFooter.find();
            const prdctSliced = prdcts.slice(0, 18); // Limit to 8 products

            res.render('user/index', { subcategor, prdct: prdctSliced, categorys, homebanner, Homepagepics, loggedIn: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports = { getproductDataIn };



