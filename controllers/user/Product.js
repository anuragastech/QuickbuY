const product =require('../../models/vender/productAdd')



let getproductpage =async (req, res) => {
    try {
        const token = req.cookies.token;
        const loggedIn = !!token; 
        // console.log("PRODUCT PAGE \n");
        const productId=req.query.name
        // console.log(productId);
        const productData = await product.findById(productId).populate('category');
         const relatedProducts = await product.find({  productname: productData.productname });



        //  console.log(relatedProducts);
        if (productData) {
         //  console.log(productData);
            res.status(200).render('user/productpage', { data: productData ,relatedProducts ,token,loggedIn});
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};






let getproductData = async (req, res) => {
    try {
        const token = req.cookies.token;
        const loggedIn = !!token; 

        let query = {};

        const { category, subcategory, size, color, priceRange } = req.method === 'POST' ? req.body : req.query;
        console.log(req.body,"updstte");
        const page = parseInt(req.query.page) || 1;
        const limit = 8;

        if (category && category.length > 0) {
            query.categoryName = { $in: category };
        }
        if (subcategory && subcategory.length > 0) {
            query.subcategoryName = { $in: subcategory };
        }
        if (size && size.length > 0) {
            query['properties.size'] = { $in: size };
        }
        if (color && color.length > 0) {
            query.color = { $in: color };
        }
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-').map(parseFloat);
            query.price = { $gte: minPrice, $lte: maxPrice };
        }

        const skip = (page - 1) * limit;

        const products = await product.find(query)
                                      .populate('category')
                                      .populate('subcategory')
                                      .skip(skip)
                                      .limit(limit);

        const totalCount = await product.countDocuments(query);

        const totalPages = Math.ceil(totalCount / limit);

        const pagination = {
            prev: page > 1 ? `?page=${page - 1}` : null,
            next: page < totalPages ? `?page=${page + 1}` : null,
            pages: []
        };

        for (let i = 1; i <= totalPages; i++) {
            pagination.pages.push({
                number: i,
                url: `?page=${i}`,
                active: i === page
            });
        }

        if (req.method === 'POST') {
            return res.json({
                products,
                pagination
            });
        }

        res.render('user/products', { products, pagination ,loggedIn});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};








module.exports= {getproductpage,getproductData }