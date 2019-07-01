const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware/index")

// index
router.get("/campgrounds", (req, res) => {
    // get campgrounds from the db
    Campground.find({}, (err, all_campgrounds) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { campgrounds: all_campgrounds });
        }
    });
});

// create
router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
    // make a new campground object
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var campground = { name: name, image: image, description: description, author: author, price: price};

    // save it to the database
    Campground.create(campground, (err, newCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newCampground);
            res.redirect("campgrounds");
        }
    });
});

// new
router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
    res.render("new");
});

// show
router.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("campgrounds");
        }
        else {
            res.render("show", { campground: foundCampground });
        }
    });
});

// destroy
router.delete("/campgrounds/:id", middleware.checkCampOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

// edit
router.get("/campgrounds/:id/edit", middleware.checkCampOwnership, (req, res) => {
    // check if the user is logged in?
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("../views/edit", { campground: foundCampground });
    });
});


// update
router.put("/campgrounds/:id/edit", middleware.checkCampOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }

    })
});

module.exports = router;