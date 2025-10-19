const User = require("../models/user.js");

// sign up form rendering 
module.exports.renderSignupForm = (req, res) =>{
    res.render("users/signup.ejs"); 
};

// api to create a new user and registering it 
module.exports.createUser = async(req, res) =>{
    try{
        let{username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) =>{
            if(err){
                next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");        
        });
        
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// api for render login form 
module.exports.renderloginForm = (req, res) =>{
    res.render("users/login.ejs"); 
};

// API for logging in the user who passes the authentication norms 
module.exports.loginUser = async(req, res) =>{
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// logout route to logout the user out from the session 
module.exports.logoutUser = (req, res, next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "Log-Out Successfully");
        res.redirect("/listings");
    });

};
