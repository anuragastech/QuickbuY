getcontact=(req,res)=>{
    res.render('user/contact')
    };
getcheckout=(req,res)=>{
    res.render('user/check-out')
    };
    getlogin=(req, res) => {
  
        return res.redirect('/admin/home');

};
getindex=(req,res)=>{


    res.render('user/index')

};
getuser=(req,res)=>{
    res.render('user/user')
    };

    module.exports={getcontact,getcheckout,getlogin,getindex,getuser}