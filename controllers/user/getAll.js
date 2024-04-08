let getcontact = (req, res) => {
    try {
        const token = req.cookies.token;
        const loggedIn = !!token; // Set loggedIn to true if token exists, false otherwise

        res.render('user/contact' ,{loggedIn});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const about =(req,res)=>{
    try {
        const token = req.cookies.token;
        const loggedIn = !!token; // Set loggedIn to true if token exists, false otherwise

        res.render('user/about' ,{loggedIn});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
  
    getlogin=(req, res) => {
  
        return res.redirect('/vender/home');

};
let getindex=(req,res)=>{


    res.render('user/index')

};
let getuser=(req,res)=>{
    res.render('user/user')
    };

    module.exports={getcontact,getlogin,getindex,getuser ,about}