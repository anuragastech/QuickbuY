const cloudinary = require("../../models/common/cloudinary");
const multer = require("../../models/common/multerconfig");
const venderprofile = require('../../models/vender/venderprofile');
const createvenderProfile = async (req, res) => {
    try {
        const { vendername, Brandname, CompanyDetails } = req.body;
        const venderId = req.vender.id

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const desiredWidth = 1080;
        const desiredHeight = 1920;

        const results = await cloudinary.uploader.upload(req.file.path, {
            width: desiredWidth,
            height: desiredHeight,
            crop: 'scale'
        });

        console.log(results);

        const existingProfile = await venderprofile.findOne({ venderId });

        if (existingProfile) {
                existingProfile.vendername = vendername;
            existingProfile.Brandname = Brandname;
            existingProfile.CompanyDetails = CompanyDetails;
            existingProfile.image = {
                public_id: results.public_id,
                url: results.secure_url
            };

            const updatedVenderProfile = await existingProfile.save();
            res.redirect('/vender/profile');
        } else {
            const newVenderProfile = new venderprofile({
                vendername: vendername,
                Brandname: Brandname,
                CompanyDetails: CompanyDetails,
                venderId: venderId,
                image: {
                    public_id: results.public_id,
                    url: results.secure_url
                }
            });

            const savedVenderProfile = await newVenderProfile.save();
            res.redirect('/vender/profile');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//  let profileget = async (req, res) => {
//     res.render("vender/profile")
//  }
let profileget = async (req, res) => {
    try {
        const venderId = req.vender.id; 
        console.log(venderId);
        const vendorProfiles = await venderprofile.find({ venderId: venderId });
        console.log(vendorProfiles);
        if (!vendorProfiles || vendorProfiles.length === 0) {
            return res.status(404).send('Vendor profile not found');
        }

        const vendername = vendorProfiles[0].vendername;
        const Brandname = vendorProfiles[0].Brandname;
        const CompanyDetails = vendorProfiles[0].CompanyDetails;
        const image = vendorProfiles[0].image;
        // console.log(vendername);

        res.render('vender/profile', { 
            vendername,
            Brandname,
            CompanyDetails,
            image
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { createvenderProfile ,profileget};
