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
	flash			= require("connect-flash"),
	seedDB			=require("./seeds.js");
//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes =require("./routes/index");

// mongoose.connect("mongodb://localhost/yelp_camp_v9", {useNewUrlParser: true});
//mongoose.connect("mongodb+srv://yelpmo:cakebox@yelpcamp-mqm3w.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(process.env.DATABASEURL, {
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
//seedDB();
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
