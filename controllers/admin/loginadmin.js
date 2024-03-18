

const secretKey = "mynameissomethinglikestartwithathatsit";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const admin=require('../../models/admin/admin')
// const secretKey = process.env.JWT_SECRET || 'defaultFallbackSecret';



const { Vonage } = require('@vonage/server-sdk')

const ForgotPassword =require('../../models/user/forgot-Password')
// Initialize Vonage client with your API key and secret
const vonages = new Vonage({
  apiKey: '71cb7d4a',
  apiSecret: 'EMyk7GgxSvSMeCgk'
});



let Addlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await admin.findOne({ email });

        if (user && !user.blocked && (await bcrypt.compare(password, user.password))) {
            console.log('Authentication successful');

            const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '2h' });

            user.token = token;
            await user.save();

            const options = {
                expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie('token', token, options);

            return res.redirect('/admin/index'); 
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

let AdminSignup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await admin.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admins = new admin({
            email,
            password: hashedPassword,
            role: 'admin',
        });

        await admins.save();

        return res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

let  getlogin = (req, res) => {
    return res.render("admin/login");
};

let  getsignUp=(req, res) => {
    res.render("admin/signup");
  };

  let   logout=(req, res) => {
    res.clearCookie("token");
  
    res.redirect("/admin/login");
  };






const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await admin.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }


        function generateOTP() {
            const length = 6; 
            const digits = '0123456789'; 
            let otp = '';
            for (let i = 0; i < length; i++) {
                otp += digits[Math.floor(Math.random() * 10)];
            }
            return otp;
        }

        const otp = generateOTP();

       const record = new ForgotPassword({ email, otp });
       await record.save();
   

        const from = "918129323813"; 
        const to = "918129323813"; 
        const text = `Your OTP for password reset is: ${otp}`;

        async function sendSMS() {
            try {
                const responseData = await vonages.sms.send({ to, from, text });
                console.log('Message sent successfully');
                console.log(responseData);
                res.redirect(`/admin/reset-password`);
            } catch (error) {
                console.error('Error sending SMS:', error);
                res.status(500).send('Error sending OTP');
            }
        }

    
        await sendSMS();

    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).send('Error generating OTP');
    }
};


const veryfyOtp = async (req, res) => {
    const {  userEnteredOTP } = req.body;
    // console.log(userEnteredOTP);
    // console.log("nfe");
    try {
      const record = await ForgotPassword.findOne({  otp: userEnteredOTP });
      if (record) {
        // console.log(record);
        res.redirect(`/admin/ResetPassword`);
      } else {
        res.status(400).send('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).send('Error verifying OTP');
    }
  };
  


  const getResetPassword = (req, res) => {
      const phoneNumber = req.query.phoneNumber;
      res.render('admin/reset-password', { phoneNumber });
  };
  

  const resetpasword = async (req, res) => {
    const {  newPassword } = req.body; 
    try {
        const record = await ForgotPassword.find({});     
     

        const hashedPassword = await bcrypt.hash(newPassword, 10);

const x=record.map(a=>a.email);
        if (!record) {
            return res.status(404).send('User not found');
        }

        const user = await admin.findOneAndUpdate({ email:x }, { password: hashedPassword });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.redirect('/login'); // Adjust the URL as per your application's routes
        } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Error resetting password');
    }
};


  
  


module.exports={Addlogin,getlogin,getsignUp ,logout,AdminSignup,forgotPassword,resetpasword,getResetPassword,veryfyOtp};