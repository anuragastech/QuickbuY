const subcategory=require('../../models/admin/subcategory')

let getsubcategories = async (req, res) => {
    try {
        // console.log("Before find");
        const subcategor = await subcategory.find({}, 'id title description image');
        console.log("After find");

        // console.log(subcategor); // Add this line to see what subcategor is
        res.render('user/categories', { subcategor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};



module.exports={getsubcategories}