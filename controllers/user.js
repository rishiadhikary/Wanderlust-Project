const User = require("../models/user.js");

module.exports.signup = async(req,res)=>{
  try{
     let {username,email,password} = req.body;
 
  let newUser = new User({
  username,email
  });
  const registeredUser = await User.register(newUser,password);
  req.login(registeredUser,(err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","successfully signed up and logged in");
    res.redirect("/listings");
  })
  
  }
  catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
  }

 
};

module.exports.renderSignupPage =  (req, res) => {
  res.render("./user/signup.ejs");
};

module.exports.login =  async(req,res)=>{
  req.flash("success","welcome to wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
  
};

module.exports.renderLoginForm = (req,res)=>{
  res.render("./user/login.ejs")
};

module.exports.logout = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      next(err);
    }
    req.flash("success","successfully logged out");
    res.redirect("/listings");
  })
}