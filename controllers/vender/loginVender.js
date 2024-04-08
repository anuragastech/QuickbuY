const register =require('../../models/vender/mongodb')

const secretKey = "mynameissomethinglikestartwithathatsit";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// const secretKey = process.env.JWT_SECRET || 'defaultFallbackSecret';


const { Vonage } = require('@vonage/server-sdk')




const ForgotPassword =require('../../models/vender/forgotPassword')
// Initialize Vonage client with your API key and secret
const vonages = new Vonage({
  apiKey: '71cb7d4a',
  apiSecret: 'EMyk7GgxSvSMeCgk'
});






let loginvender = async (req, res) => {
    try {
        const { email, password } = req.body;
        const vender = await register.findOne({ email });
// console.log("fdnjegfbjkbgef");
console.log(vender,"heikfgjfgj");

        if (vender && !vender.blocked && (await bcrypt.compare(password, vender.password))) {        
            console.log('Authentication successful');

            const token = jwt.sign({ id: vender._id, role: vender.role }, secretKey, { expiresIn: '2h' });

            vender.token = token;
            await vender.save();

            const options = {
                expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie('token', token, options);

            return res.status(200).json({ message: 'Login successful', vender: vender });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
               
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





let signvender = async(req,res)=>{
    try {
        // console.log("njvrn");
        const { name, email, password } = req.body;
        const myEncryptedPassword = await bcrypt.hash(password, 10);

        const newvender = new register({
            name,
            password: myEncryptedPassword,
            email,
            role: 'vender', 
            blocked:'false',
        });

        await newvender.save();

        const token = jwt.sign({ id: newvender._id, role: newvender.role }, secretKey, { expiresIn: '2h' });

        newvender.token = token;
        await newvender.save();

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







const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Find the user by email
        const user = await register.findOne({ email });
        if (!user) {
            // If user doesn't exist, show an alert
            return res.status(404).send('User not found');
        }


        // Function to generate OTP
        function generateOTP() {
            const length = 6; // Length of the OTP
            const digits = '0123456789'; // Allowed characters in the OTP
            let otp = '';
            for (let i = 0; i < length; i++) {
                otp += digits[Math.floor(Math.random() * 10)];
            }
            return otp;
        }

        // Generate OTP
        const otp = generateOTP();

       // Store the generated OTP along with the email in the cache with expiration time
       const record = new ForgotPassword({ email, otp });
       await record.save();
   

        const from = "918129323813"; // Replace with your Vonage virtual number
        const to = "918129323813"; // Recipient's phone number
        const text = `Your OTP for password reset is: ${otp}`;

        async function sendSMS() {
            try {
                const responseData = await vonages.sms.send({ to, from, text });
                console.log('Message sent successfully');
                console.log(responseData);
                // Redirect to the reset password page
                res.redirect(`/vender/reset-password`);
            } catch (error) {
                console.error('Error sending SMS:', error);
                res.status(500).send('Error sending OTP');
            }
        }

        // Call the sendSMS function
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
        res.redirect(`/vender/ResetPassword`);
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
      res.render('vender/reset-password', { phoneNumber });
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

        const user = await register.findOneAndUpdate({ email:x }, { password: hashedPassword });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.redirect('/vender/login'); // Adjust the URL as per your application's routes.
        } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Error resetting password');
    }
};


  
module.exports={loginvender,getlogin,signvender,getsignup ,logout,forgotPassword,resetpasword,getResetPassword,veryfyOtp};