const { subcategory } = require("../../models/admin/subcategory");

let getsubcategories = async (req, res) => {
    try {
        const subcategories = await subcategory.find({}, 'id title description image');
        console.log(subcategories); // Add this line
        res.render('user/subcategories', { subcategories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
module.exports={getsubcategories}