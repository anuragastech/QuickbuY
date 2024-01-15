
getcolor=async (req, res) => {
    try {
      const newColor = await color.find();
      res.json({ newColor });
    } catch (error) {
      console.error("Error fetching color:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getsize=async (req, res) => {
    try {
      const newSize = await size.find();
      res.json({ newSize });
    } catch (error) {
      console.error("Error fetching color:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getAddproduct= (req, res) => {
    res.render("vender/Addcolor");
  };

  getAddsize=(req, res) => {
    res.render("vender/Addsize");
  };
  getHome=(req, res) => {
    res.render("vender/signup");
  };

  

  module.exports={getHome,getAddsize,getAddproduct,getsize,getcolor};
