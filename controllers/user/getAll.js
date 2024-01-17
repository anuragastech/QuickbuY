let getcontact=(req,res)=>{
    res.render('user/contact')
    };
    let getcheckout=(req,res)=>{
    res.render('user/check-out')
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

    module.exports={getcontact,getcheckout,getlogin,getindex,getuser}