const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");

// index
router.get("/campgrounds", (req, res) => {
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
router.post("/campgrounds", isLoggedIn, (req, res) => {
    // make a new campground object
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var campground = {name: name, image: image, description: description, author: author};

    // save it to the database
    Campground.create(campground, (err, newCampground) => {
        if(err){
            console.log(err);
        }
        else{
            console.log(newCampground);
            res.redirect("campgrounds");
        }
    });
});

// new
router.get("/campgrounds/new", isLoggedIn, (req, res) => {
    res.render("new");
});

// show
router.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) => {
        if(err){
            console.log(err);
        }
        else{
            res.render("show", {campground: foundCampground});
        }
    });
});

// edit
router.get("/campgrounds/:id/edit", (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            res.redirect("/campgrounds");
        }
        else {
            res.render("../views/edit", {campground: foundCampground});
        }
    });
});

// update
router.put("/campgrounds/:id/edit", (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}

module.exports = router;