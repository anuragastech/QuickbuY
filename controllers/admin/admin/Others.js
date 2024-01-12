postSize=async (req, res) => {
    try {
        const { title, description } = req.body;

        // if (!req.file) {
        //     return res.status(400).json({ success: false, message: 'No file uploaded' });
        // }

        // const desiredWidth = 300;
        // const desiredHeight = 200;

        // const result = await cloudinary.uploader.upload(req.file.path, {
        //     width: desiredWidth,
        //     height: desiredHeight,
        //     crop: 'scale' 
        // });
        
        const newSize = new size({
            title: title,
            // description: description,
            // image: {
            //     public_id: result.public_id,
            //     url: result.secure_url
            // },
        });

        const savedSize= await newSize.save();

        res.redirect('/admin/Addsize');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

postcolor= async (req, res) => {
    try {
        const { title, description } = req.body;

        // if (!req.file) {
        //     return res.status(400).json({ success: false, message: 'No file uploaded' });
        // }

        // const desiredWidth = 300;
        // const desiredHeight = 200;

        // const result = await cloudinary.uploader.upload(req.file.path, {
        //     width: desiredWidth,
        //     height: desiredHeight,
        //     crop: 'scale' 
        // });
        
        const newColor = new color({
            title: title,
            // description: description,
            // image: {
            //     public_id: result.public_id,
            // //     url: result.secure_url
            // },
        });

        const savedColor= await newColor.save();

        res.redirect('/admin/Addcolor');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

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
    res.render("admin/Addcolor");
  };

  getAddsize=(req, res) => {
    res.render("admin/Addsize");
  };
  getHome=(req, res) => {
    res.render("admin/signup");
  };

  module.exports={getHome,getAddsize,getAddproduct,getsize,getcolor,postcolor,postSize};
