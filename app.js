const express      =require("express"),
	  mongoose     =require("mongoose"),
      app          =express(),
	  uri          = process.env.ATLAS_URI;
var bodyParser       =require("body-parser"),
Campground       =require("./models/campground"),
Comment			 =require("./models/comment"),
User			 =require("./models/user"),
seedDB			 =require("./seeds"),
flash            =require("connect-flash"),
passport		 =require("passport"),
LocalStrategy    =require("passport-local"),
methodOverride   =require("method-override");

//seedDB();
app.use(flash());
require('dotenv').config();
//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"again rusty is the best",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//will call this function on all routes
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

//requiring routes
var commentRoutes=require("./routes/comments"),
	campgroundRoutes=require("./routes/campgrounds"),
	indexRoutes=require("./routes/index");
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify:false});
//mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify:false});
//mongoose.connect('mongodb+srv://Manar:mypass@cluster0-czheo.mongodb.net/yelp_camp?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify:false, useCreateIndex:true});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.listen(process.env.PORT || 3000,process.env.IP,function(){console.log("YelpCamp server has started");});