var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
router.get("/", (req, res)=>{
	Campground.find({},(err, allCampgrounds)=>{
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	});
});
router.post("/", middleware.isLoggedIn, (req,res)=>{
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user.id,
		username: req.user.username
	};
	var newCampGround = {name:name, image:image, description:desc, author:author};
	Campground.create(newCampGround,(err, newCamp)=>{
		if(err){
			console.log(err);
		}else{
			console.log("Added new Campground to DB: ");
			console.log(newCamp);
		}
	});
	res.redirect("/campgrounds");
});
//show route
router.get("/new", middleware.isLoggedIn, (req,res)=>{
	res.render("campgrounds/new");
});
router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	}).populate("comments").exec((err, data)=>{
				if(err){
					console.log(err);
				}else{
					console.log(data);
				}
			});
	
});
//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findById(req.params.id,(err,campground)=>{
	res.render("campgrounds/edit", {campground: campground});
	});
});
//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		res.redirect("/campgrounds");
	});
	
});


module.exports = router;