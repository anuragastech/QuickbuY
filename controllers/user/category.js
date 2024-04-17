
const category=require('../../models/admin/category')

let getcategory=(req,res)=>{


    res.render('user/categories')

};
let getcategorys= async (req, res) => {
    try {
        // const {productId}=req.params.id
        const token = req.cookies.token;
        const loggedIn = !!token; // Set loggedIn to true if token exists, false otherwise

       
        const categories = await category.find({}, 'id title description image');
        // console.log(categories); // Add this line
        res.render('user/category', { categories ,loggedIn });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};




module.exports={getcategory,getcategorys};
