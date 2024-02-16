let getcontact=(req,res)=>{
    res.render('user/contact')
    };
  
    getlogin=(req, res) => {
  
        return res.redirect('/vender/home');

};
let getindex=(req,res)=>{


    res.render('user/index')

};
let getuser=(req,res)=>{
    res.render('user/user')
    };

    module.exports={getcontact,getlogin,getindex,getuser}