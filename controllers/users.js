 const User=require("../models/user")
 module.exports.renderForm=(req,res)=>{
    res.render("users/signup.ejs");
};
 module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser= new User({email,username});
        const registerUser= await User.register(newUser,password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to Wanderlust");
            res.redirect("/listings");
        })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
    };
module.exports.Login=async(req,res)=>{
    req.flash("success","Welcome back to wanderLust!");
    //console.log(req.session.redirectUrl);
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};
module.exports.Logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logOut!");
        res.redirect("/listings");
    })
};

