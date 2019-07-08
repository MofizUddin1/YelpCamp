var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all the middleware
 var middlewareObj={};
middlewareObj.checkCampgroundOwnership = function(req,res,next){
	Campground.findById(req.params.id,(err,campground)=>{
		if(req.isAuthenticated()){
			if (err){
				console.log(err);
				req.flash("error", "You need to be logged in");
				res.redirect("back");
			}else{
				if(campground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "Campground not found");
					res.redirect("back");
				}
			}
		}else{
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
		}
	});
};
middlewareObj.checkCommentOwnership = function(req,res,next){
	Comment.findById(req.params.comment_id,(err,comment)=>{
		if(req.isAuthenticated()){
			if (err){
				console.log(err);
				req.flash("error", "You need to be logged in");
				res.redirect("back");
			}else{
				if(comment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "Comment not found");
					res.redirect("back");
				}
			}
		}else{
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
		}
	});
};
middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		req.flash("error", "Must be logged in first!");
		res.redirect("/login");
	}
};
middlewareObj.isIdentical = function(req,res,next){
	if(req.body.password === req.body.confirm_password){
		next();
	}else{
		req.flash("error", "Passwords do not match");
		res.redirect("/register");
	}
};

module.exports = middlewareObj;
