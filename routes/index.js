var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
//root route
router.get("/",(req,res)=>{
	res.render("landing");
});
//register form route
router.get("/register",(req,res)=>{
	res.render("register");
});
//sign up logic route
router.post("/register",(req,res)=>{
	var newUser =  new User({username: req.body.username});
	User.register(newUser,req.body.password, (err,user)=>{
		if (err){
			req.flash("error", err.message);
			return res.redirect("register");
		}else{
			passport.authenticate("local")(req,res,()=>{
				req.flash("success", "Signed up! Welcome to YelpCamp " +user.username);
				res.redirect("/campgrounds");
			});	
		}
	});
});
//show login form
router.get("/login",(req,res)=>{
	res.render("login");
});
//show register form
router.post("/login", passport.authenticate("local",{
	successFlash: "Successfully logged in!" ,
	successRedirect: "/campgrounds",
	failureFlash:'Login failed',
	failureRedirect: "/login",
}),(req,res)=>{});
//logout route
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success", "logged out");
	res.redirect("/campgrounds");
});

module.exports = router;