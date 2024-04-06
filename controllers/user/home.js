
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



const Search = async (req, res) => {
    try {
        const { search } = req.method === 'POST' ? req.body : req.query;


        if (!search || search.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Search query is required.' });
        }

        // Search for products based on name, description, category, subcategory, size, color, etc.
        const products = await product.find({
            $or: [
                { productname: { $regex: search, $options: 'i' } }, // Assuming productname is the field for product name
                { description: { $regex: search, $options: 'i' } },
                { categoryName: { $regex: search, $options: 'i' } },
                { subcategoryName: { $regex: search, $options: 'i' } },
                { 'properties.size': { $regex: search, $options: 'i' } },
                { color: { $regex: search, $options: 'i' } },
                // Add more fields as needed for search
            ]
        }).populate('category').populate('subcategory');
        console.log(products,"hehfheuwfhue");

        // Render the search page with the fetched products
        res.render('user/search', { products, searchQuery: search });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports = { getproductDataIn ,Search};



