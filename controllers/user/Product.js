const product =require('../../models/vender/productAdd')


let getproductpage =async (req, res) => {
    try {
        // console.log("PRODUCT PAGE \n");
        const productId=req.query.name
        // console.log(productId);
         const productData = await product.findById({ _id: (productId) });
         console.log("DATAS ARE",productData);


         const colorMatch= await  product.agg
        if (productData) {
         //  console.log(productData);
            res.status(200).render('user/productpage', { data: productData  });
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




module.exports= {getproductpage,getproductData}