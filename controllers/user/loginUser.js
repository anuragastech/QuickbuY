const secretKey =  'mynameissomethinglikestartwithathatsit';
const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken');

const create=require('../../models/user/mongodb')
 const nodemailer=require("nodemailer");
const { response } = require('express');
 
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

        res.redirect('login');
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

            return res.redirect('index');
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
        
            res.redirect("/user/login");
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
                res.redirect("/user/contact"); 
            });
        };





        const profileData = async (req, res) => {
            try {
                const { facebook, instagram, twitter, github, phonenumber, email, Fullname ,website} = req.body;
                const userId = req.user.id;
                console.log(userId);
                // Find the user by userId
                let existingUser = await create.findById(userId);
        
                if (existingUser) {
                    // If the user exists, update their profile
                    existingUser.profileData.push({
                        facebook: facebook,
                        Instegram: instagram,
                        Twittwer: twitter,
                        Website:website,
                        Github: github,
                        phonenumber: phonenumber,
                        email: email,
                        fullname: Fullname
                    });
                } else {
                    // If user does not exist, create a new profile
                    existingUser = await create.create({
                        userId: userId,
                        profileData: [{
                            userId: userId,
                            facebook: facebook,
                            Instegram: instagram,
                            Twittwer: twitter,
                            Website:website,
                            Github: github,
                            phonenumber: phonenumber,
                            email: email,
                            Fullname: Fullname,
                        }]
                    });
                }
                console.log(existingUser);

                // Save the changes
                await existingUser.save();
        
                // Assuming you want to send back some response after updating/creating the profile
                res.status(200).json({ message: 'Profile updated/created successfully', profileData: existingUser.profileData });
            } catch (error) {
                console.error('Error updating/creating profile:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        
        
        
module.exports={Addlogin,Addsign,getsign,getlogin,getlogout,sendmail ,profileData };