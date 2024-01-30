const Saved =require('../../models/admin/saved')

const secretKey = "mynameissomethinglikestartwithathatsit";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const secretKey = process.env.JWT_SECRET || 'defaultFallbackSecret';


let  loginPost=async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Saved.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {

            console.log('Authentication successful');

            const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '2h' });

            user.token = token;
            await user.save();

            const options = {
                expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie('token', token, options);

            return res.redirect('/admin/main');
            
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

let  getlogin = (req, res) => {
    return res.render("admin/login");
};

let  getsignup=(req, res) => {
    res.render("admin/signup");
  };

  let   logout=(req, res) => {
    res.clearCookie("token");
  
    res.redirect("/admin/login");
  };

module.exports={loginPost,getlogin,getsignup ,logout};