const category =require('../../models/admin/category')
const subcategory =require('../../models/admin/subcategory')

let getcolor= async (req, res) => {
    try {
      const newColor = await color.find(); 
      res.json({ newColor });
    } catch (error) {
      console.error('Error fetching color:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  let getsubcategory= async (req, res) => {
    try {
      const subcategories = await subcategory.find(); 
      res.json({ subcategories });
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  let getsize=async (req, res) => {
    try {
      const newSize = await size.find(); 
      res.json({ newSize });
    } catch (error) {
      console.error('Error fetching color:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  let getcategory=async (req, res) => {
    try {
      const categories = await category.find(); 
      res.json({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


module.exports={ getcategory,getsize,getcolor,getsubcategory};