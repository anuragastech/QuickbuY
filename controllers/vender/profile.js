const cloudinary = require("../../models/common/cloudinary");
const multer = require("../../models/common/multerconfig");
const venderprofile = require('../../models/vender/venderprofile');

let createvenderProfile = async (req, res) => {
    try {
        const upload = multer.single("image"); // Move multer middleware here
        
        upload(req, res, async function (err) {
            if (err && err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(400).json({ error: 'Multer error occurred' });
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            
            // Check if req.file is undefined
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const { vendername, email } = req.body;
            const desiredWidth = 1080;
            const desiredHeight = 1920;

            // Upload the file to Cloudinary
            const results = await cloudinary.uploader.upload(req.file.path, {
                width: desiredWidth,
                height: desiredHeight,
                crop: 'scale'
            });

            // Create a new vender profile object
            const newvenderprofile = new venderprofile({
                vendername: vendername,
                email: email,
                image: {
                    public_id: results.public_id,
                    url: results.secure_url
                }
            });

            // Save the vender profile
            const savedvenderprofile = await newvenderprofile.save();

            // Return the saved vender profile in the response
            res.status(201).json(savedvenderprofile);
        });
    } catch (error) {
        // Catch any unhandled errors
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

let profileget = async (req, res) => {
    try {
        const profile = await venderprofile.find();
        return res.render('vender/profile', { profile }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = { createvenderProfile ,profileget};
