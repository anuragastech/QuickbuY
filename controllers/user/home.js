
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
            const prdctSliced = prdcts.slice(0, 18); // Limit to 18 products

            if (subcategor.length >= 8 && categorys.length >= 8 && prdctSliced.length >= 8) {
                res.render('user/index', { subcategor, prdct: prdctSliced, categorys, homebanner, Homepagepics, loggedIn: true });
            } else {
                res.render('user/index', { homebanner, Homepagepics, loggedIn: true });
            }
        } else {
            const subcategor = await subcategory.find({}, 'id title description image');
            const categorys = await category.find({}, 'id title description image');
            const prdcts = await product.find().populate('category').populate('subcategory');
            const homebanner = await Homepagepic.find({}, 'h1 h2 image');
            const Homepagepics = await HomepageFooter.find();
            const prdctSliced = prdcts.slice(0, 18); // Limit to 18 products

            // Check if any of the arrays have less than 8 items
            if (subcategor.length >= 8 && categorys.length >= 8 && prdctSliced.length >= 8) {
                res.render('user/index', { homebanner, Homepagepics, loggedIn: false });
            } else {
                res.render('user/index', { homebanner, Homepagepics, loggedIn: false });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};





const Search = async (req, res) => {
    try {
        const token = req.cookies.token;
        const loggedIn = !!token; 

        const { search } = req.method === 'POST' ? req.body : req.query;

        console.log(search,"hehfheuwfhue");

        if (!search || search.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Search query is required.' });
        }

        const products = await product.find({
            $or: [
                { productname: search }, 
                { description: search },
                { categoryName: search },
                { subcategoryName: search },
                { 'properties.size': search },
                { color: search },
            ]
        }).populate('category').populate('subcategory');

        console.log(products,"daaa");
        // Render the search page with the fetched products
        res.render('user/search', { products, searchQuery: search ,loggedIn});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};






module.exports = { getproductDataIn ,Search};



