const register =require('../../models/vender/mongodb')

const secretKey = "mynameissomethinglikestartwithathatsit";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const secretKey = process.env.JWT_SECRET || 'defaultFallbackSecret';


let loginvender = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await register.findOne({ email });


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

            return res.redirect('/vender/productlist');
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
            // res.redirect('/vender/login')
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


let signvender = async(req,res)=>{
    try {
        const { name, email, password } = req.body;
        const myEncryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new register({
            name,
            password: myEncryptedPassword,
            email,
            role: 'vender', 
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, secretKey, { expiresIn: '2h' });

        newUser.token = token;
        await newUser.save();

        const options = {
          expires: new Date(Date.now() + 2 * 60 * 60 * 1000),  
            httpOnly: true,
        };

        res.cookie('token', token, options);

        res.redirect('/vender/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

 let getlogin = (req, res) => {
    return res.render("vender/login");
};

 let getsignup=(req, res) => {
    res.render("vender/signup");
  };
 let  logout=(req, res) => {
    res.clearCookie("token");
  
    res.redirect("/vender/login");
  };

module.exports={loginvender,getlogin,signvender,getsignup ,logout};