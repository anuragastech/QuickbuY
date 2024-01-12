const resgister=require('../../../models/admin/mongodb')

// const secretKey = "mynameissomethinglikestartwithathatsit";
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cloudinary = require("/home/anurag/");

loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await resgister.findOne({ email });

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

            return res.redirect('/admin/home');
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


signAdmin = async(req,res)=>{
    try {
        const { name, email, password } = req.body;
        const myEncryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new resgister({
            name,
            password: myEncryptedPassword,
            email,
            role: 'admin', 
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

        res.redirect('/admin/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

getlogin = (req, res) => {
    return res.render("admin/login");
};

 getsignup=(req, res) => {
    res.render("admin/signup");
  };

module.exports={loginAdmin,getlogin,signAdmin,getsignup};