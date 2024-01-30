const cloudinary = require("../../models/common/cloudinary");
const multer = require("../../models/common/multerconfig");
const upload = multer.single("image");

const userprofile = require('../../models/vender/userprofile');

let createUserProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const desiredWidth = 1080;
        const desiredHeight = 1920;

        const result = await cloudinary.uploader.upload(req.file.path, {
            width: desiredWidth,
            height: desiredHeight,
            crop: 'scale'
        });

        const userProfilePic = new userprofile({
            username: username,
            email: email,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            }
        });
console.log(userProfilePic);

const userProfilePicsave =  await userProfilePic.save();

        return res.status(200).json({ success: true, message: 'User profile updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports={createUserProfile}