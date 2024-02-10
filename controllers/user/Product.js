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

let getproductData= async (req, res) => {
    try {
        const products = await product.find().populate('category').populate('subcategory');
        res.render('user/products', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};






// / Endpoint to handle filtering products
   let filteredProduct = async (req, res) => {
    const { category, subcategory, size, color, priceRange } = req.body;

    try {
        let query = {};

        // Construct the query based on filter options
        if (category.length > 0) {
            query.category = { $in: category };
        }
        if (subcategory.length > 0) {
            query.subcategory = { $in: subcategory };
        }
        if (size.length > 0) {
            query['properties.size'] = { $in: size };
        }
        if (color.length > 0) {
            query.color = { $in: color };
        }
        if (priceRange) {
            // Assuming price is stored as a number
            const [minPrice, maxPrice] = priceRange.split('-').map(parseFloat);
            query.price = { $gte: minPrice, $lte: maxPrice };
        }

        // Fetch filtered products from the database
        const filteredProducts = await product.find(query);

        res.json(filteredProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to filter products' });
    }
};



module.exports= {getproductpage,getproductData ,filteredProduct}