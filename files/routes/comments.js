const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware/index")

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render("comments/new", { campground: campground });
    });
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", "Something went wrong");
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

// edit
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err || !foundComment){
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            res.render("../views/comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
})

// update
router.put("/campgrounds/:id/comments/:comment_id/", middleware.checkCommentOwnership, (req, res) => {
    console.log(req.body.comment.text);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});

module.exports = router;