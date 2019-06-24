const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");

router.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render("comments/new", { campground: campground });
    });
});

router.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
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