// Setup ----------------------------------------------------
const express       = require("express");                //for requests
const app           = express();
const bodyParser    = require("body-parser");           //for parsing requests
const mongoose      = require("mongoose");              //for database
const passport      = require("passport");              //for user authentication
const LocalStragety = require("passport-local");        //for user authentication

const Campground    = require("./models/campground");   //setup campground logic
const Comment       = require("./models/comment");      //setup comment logic
const User          = require("./models/user");
const seedDB        = require("./seeds");               //seed info for database

// use ejs, body-parser, and connect to mongoose
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

// seed the database with info from seedDB.js
seedDB();

// ----------------------------------------------------------
// passport configuration
app.use(require("express-session")({
    secret: "grilled Watermelon tastes pretty Good",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
passport.use(new LocalStragety(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// RESTful routes -------------------------------------------
app.get("/", (req, res) => {
    res.render("landing");
});

// index
app.get("/campgrounds", (req, res) => {
    // get campgrounds from the db
    Campground.find({}, (err, all_campgrounds) => {
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {campgrounds: all_campgrounds});
        }
    });
});

// create
app.post("/campgrounds", (req, res) => {
    // make a new campground object
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var campground = {name: name, image: image, description: description};

    // save it to the database
    Campground.create(campground, (err, newCampground) => {
        if(err){
            console.log(err);
        }
        else{
            res.redirect("campgrounds");
        }
    });
});

// new
app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

// show
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) => {
        if(err){
            console.log(err);
        }
        else{
            res.render("show", {campground: foundCampground});
        }
    });
});

// Comments Routes -------------------------------------------
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render("comments/new", {campground: campground});
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
// ----------------------------------------------------------






// Auth routes ----------------------------------------------
// register form
app.get("/register", (req,res) => {
    res.render("register");
});

// sign up
app.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    });
});

// login get
app.get("/login", (req, res) => {
    res.render("login");
});

// login post
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

// logout get
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});
// ----------------------------------------------------------


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

// tell the app to listen for requests on port 3000
app.listen(3000, () => {
    console.log("Yelpcamp server running...");
})
// ----------------------------------------------------------