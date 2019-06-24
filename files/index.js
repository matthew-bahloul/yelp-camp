// Setup ----------------------------------------------------
const express       = require("express");                //for requests
const app           = express();
const bodyParser    = require("body-parser");           //for parsing requests
const mongoose      = require("mongoose");              //for database
const passport      = require("passport");              //for user authentication
const LocalStragety = require("passport-local");        //for user authentication

const commentRoutes     = require("./routes/comments"),
      campgroundRoutes  = require("./routes/campgrounds"),
      authRoutes        = require("./routes/auth");
const methodOverride= require("method-override");
const Campground    = require("./models/campground");   //setup campground logic
const Comment       = require("./models/comment");      //setup comment logic
const User          = require("./models/user");
const seedDB        = require("./seeds");               //seed info for database

// use ejs, body-parser, and connect to mongoose
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

// seed the database with info from seedDB.js
// seedDB();

// ----------------------------------------------------------
// passport configuration
app.use(require("express-session")({
    secret: "grilled Watermelon tastes pretty Good",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// pass user to all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
passport.use(new LocalStragety(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// routes
app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);


// tell the app to listen for requests on port 3000
app.listen(3000, () => {
    console.log("Yelpcamp server running...");
})