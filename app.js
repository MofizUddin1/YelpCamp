var express 		= require("express"),
 	app 			= express(),
 	bodyParser 		= require("body-parser"),
	mongoose		=require("mongoose"),
	Comment			=require("./models/comment"),
	Campground 		=require("./models/campground.js"),
	passport		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	User			= require("./models/user"),
	methodOverride 	= require("method-override"),
	flash			= require("connect-flash");
//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes =require("./routes/index");
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v9";
mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=>{
	console.log('connected to DB"');
}).catch(err => {
	console.log('ERROR:', err.message);
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
	secret:"i am cool",
	resave: false,
	saveUnintialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//user.authenticate comes from passport-local-mongoose. if we didnt require it, we will need to write our own
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
	//provides access to every template
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", authRoutes);
app.use( "/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT,process.env.IP,()=>{
	console.log("YelpCamp server started!");
});
