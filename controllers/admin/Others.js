const productAdd=require('../../models/vender/productAdd')

const create=require('../../models/user/mongodb')

const register=require('../../models/vender/mongodb')

const coupenIn=require('../../models/user/mongodb')

let venderlist = async (req, res) => {
  try {

  const productList = await productAdd.find()
  .populate("category")
  .populate("subcategory");

      res.render('admin/vender-product-list', { products: productList }); 
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
let venderadmin=async(req,res)=>{
  try{
  const venderData=  await register.find();
  res.render('admin/Vender',{venderData});
  }catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
}
}

let userlist=async(req,res)=>{
  try{
  const userData=  await create.find();
  res.render('admin/User',{userData});
  }catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
}
}

let deleteUser = async (req, res) => {
  try {
    const userId = req.params.Id;
    const deleteUsers = await create.findOneAndDelete({ id: userId });

    if (!deleteUsers) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting User" }); // Close parenthesis
  }
};
let deletVender=async (req, res) => {
  try {
    const userId = req.params.Id;
    const deleteVenders = await register.findOneAndDelete({ id: userId });

    if (!deleteVenders) {
      return res.status(404).json({ message: "Vender not found" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting User" }); // Close parenthesis
  }
};


let getCoupen =(req,res)=>{
  res.render('admin/coupen')
};


let postCoupen=async (req,res)=>{
  const couponCode = req.body.couponCode;
  const discountPercentage = req.body.discountPercentage;
  const newCoupon = new coupenIn({
    couponCode,
    discountPercentage
  });

  await newCoupon.save();
  // console.log('Coupon Code:', couponCode);
  // console.log('Discount Percentage:', discountPercentage);

  res.send('Coupon created successfully!');
};





  module.exports={venderlist,venderadmin, userlist ,deleteUser ,deletVender,getCoupen,postCoupen} ;
