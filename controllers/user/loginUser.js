const secretKey =  'mynameissomethinglikestartwithathatsit';
const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken');
const Order =require("../../models/user/order")
const create=require('../../models/user/mongodb')
 const nodemailer=require("nodemailer");
const { response } = require('express');
const profile=require('../../models/user/mongodb')
const cloudinary = require("../../models/common/cloudinary");
const { Vonage } = require('@vonage/server-sdk')

const ForgotPassword =require('../../models/user/forgot-Password')
// Initialize Vonage client with your API key and secret
const vonages = new Vonage({
  apiKey: '71cb7d4a',
  apiSecret: 'EMyk7GgxSvSMeCgk'
});



const otpCache = new Map(); // Using a Map to store OTPs temporarily

const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds



// require('dotenv').config(); // Load environment variables
// const twilio = require('twilio');

// const accountSid = "ACab0bff2c60ea38e03fa4814041e5e86f";
// const authToken = "3b2976ea427d81e9b01c4715e03eb455";
// // const twilioPhoneNumber = "9995937035"
// const twilioClient = twilio(accountSid, authToken);

// client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+918129323813", channel: "sms" })
//   .then((verification) => console.log(verification.status))
//   .then(() => {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });


// const client = twilio(accountSid, authToken);

// client.messages
//     .create({
//         body: 'This is a test message sent from Twilio!',
//         from: twilioPhoneNumber,
//         to: '+1234567890' // Replace with the recipient's phone number
//     })
//     .then(message => console.log('Message sent. SID:', message.sid))
//     .catch(error => console.error('Error sending message:', error));



 
let Addsign=async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const repeatPassword = req.body.repeatPassword;
        if (password !== repeatPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const myEncryptedPassword = await bcrypt.hash(password, 10);

        const newCreate = new create({
            name: username,
            email:email,
            password: myEncryptedPassword,
            role: 'user',
            blocked:'false',
        });
console.log(newCreate);
        await newCreate.save();

        const token = jwt.sign({ id: newCreate._id, role: newCreate.role }, secretKey, { expiresIn: '2h' });

        newCreate.token = token;
        // newUser.password = undefined;


        await newCreate.save();

        const options = {
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie('token', token, options);

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
let Addlogin  = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await create.findOne({ email });

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

            return res.redirect('/');
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
let getsign=(req,res)=>{

 res.render('user/sign');
    };
    let getlogin=(req,res)=>{
        res.render('user/login')
        };

        
        let getlogout= (req, res) => {
            res.clearCookie("token");
        
            res.redirect("/login");
        };



        const sendmail = async (req, res) => {
            const { name, email, subject, message } = req.body;
        
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "anuragraveendren98in@gmail.com",
                    pass: "pjfs jyzp ykfu qnnd"
                }
            });
        
            const mailOptions = {
                from: email,
                to: "anuragraveendren98in@gmail.com",
                subject: subject,
                text: message ,
            };
        
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
                res.redirect("/contact"); 
            });
        };
        
        const GetProfile = async (req, res) => {
            const userId = req.user.id;
            try {
                const getProfileData = await profile.findOne({ _id: userId });
        const orderData =await Order.find({userId:userId})
        console.log("jbhfrtrnj");
        console.log(orderData,"mkerjtnjbhfb");
                res.render('user/profile', { profileData: getProfileData.profileData }); 
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        }
        
        
        
        
        
        const profileData = async (req, res) => {
            try {
                const { facebook, instagram, twitter, github, phonenumber, email, Fullname, website } = req.body;
                const userId = req.user.id;
                // console.log(req.body);
        
                let existingUser = await create.findById(userId);
        
                if (existingUser) {
                    if (existingUser.profileData) {

                        existingUser.profileData = {
                            facebook: facebook,
                            instagram: instagram,
                            twitter: twitter,
                            website: website,
                            github: github,
                            phoneNumber: phonenumber,
                            email: email,
                            fullname: Fullname
                        };
                    } else {

                        existingUser.profileData = {
                            facebook: facebook,
                            instagram: instagram,
                            twitter: twitter,
                            website: website,
                            github: github,
                            phoneNumber: phonenumber,
                            email: email,
                            fullname: Fullname
                        };
                    }
        
                    await existingUser.save();
        
                    res.status(200).json({ message: 'Profile updated/created successfully', profileData: existingUser.profileData });
                } else {
                    res.status(404).json({ message: 'User not found' });
                }
            } catch (error) {
                console.error('Error updating/creating profile:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        


        let postAddresses = async (req, res) => {
            try {
                const { address, phone, country, city, state, pin } = req.body;
                const userId = req.user.id;
        
                const currentUser = await create.findById(userId);
                currentUser.personalInfo.push({ address, number: phone, country, state, city, pincode: pin });
        
                await currentUser.save();
        
                res.redirect('/profile');
                } catch (error) {
                console.error('Error saving address:', error);
                res.status(500).json({ message: 'Failed to save address' });
            }
        };
        


        const postProfilepic = async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ success: false, message: 'No file uploaded' });
                }
        
                const desiredWidth = 300;
                const desiredHeight = 200;
        
                const result = await cloudinary.uploader.upload(req.file.path, {
                    width: desiredWidth,
                    height: desiredHeight,
                    crop: 'scale' 
                });
        
                console.log('Image uploaded to Cloudinary:', result);
        
                const userProfile = await profile.findById(req.user.id);
                
                userProfile.image = {
                    url: result.secure_url,
                    public_id: result.public_id
                };
        
                await userProfile.save();
        
                res.status(200).json({ success: true, message: 'Image uploaded successfully to Cloudinary and saved to the profile' });
            } catch (error) {
                console.error('Error uploading image to Cloudinary:', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        };
        






const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await create.findOne({ email });
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
                res.redirect(`/reset-password`);
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
        res.redirect(`/ResetPassword`);
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
      res.render('user/reset-password', { phoneNumber });
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


        const user = await create.findOneAndUpdate({ email:x }, { password: hashedPassword });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.redirect('/login'); 
      } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Error resetting password');
    }
};


  


module.exports={Addlogin,Addsign,getsign,getlogin,getlogout,sendmail ,profileData ,GetProfile, postAddresses,postProfilepic ,forgotPassword,veryfyOtp,getResetPassword,resetpasword};