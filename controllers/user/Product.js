const product =require('../../models/vender/productAdd')


let getproductpage =async (req, res) => {
    try {
        // console.log("PRODUCT PAGE \n");
        const productId=req.query.name
        // console.log(productId);
        const productData = await product.findById(productId).populate('category');
         const relatedProducts = await product.find({  productname: productData.productname });



        //  console.log(relatedProducts);
        if (productData) {
         //  console.log(productData);
            res.status(200).render('user/productpage', { data: productData ,relatedProducts });
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
        let query = {};

        // Extract query parameters for filtering from both query and body
        const { category, subcategory, size, color, priceRange } = req.method === 'POST' ? req.body : req.query;
        // console.log(size);
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

        const products = await product.find(query).populate('category').populate('subcategory');
// console.log(query.properties.size);
        // Check if the request is a POST request, if so, return JSON response
        if (req.method === 'POST') {
            return res.json(products);
        }

        // Render the user/products page with the fetched products
        res.render('user/products', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



     





module.exports= {getproductpage,getproductData }