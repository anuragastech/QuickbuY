const subcategory=require('../../models/admin/subcategory')
const product=require('../../models/vender/productAdd')
let getsubcategories = async (req, res) => {
    try {
        const { id: subcategoryId } = req.params;
// console.log(subcategoryId);
        // Find related products based on the selected subcategory ID
        const relatedProductIn = await product.find({ subcategory: subcategoryId });

        console.log(relatedProductIn); // Log related products to console

        const subcategor = await subcategory.find({}, 'id title description image');

        res.render('user/categories', { relatedProductIn, subcategor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};





module.exports={getsubcategories}