const express = require("express");
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");
const middleware = require("../middleware/index")

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req,res) => {
    res.render("register");
});

// sign up
router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// login get
router.get("/login", (req, res) => {
    res.render("login");
});

// login post
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

// logout get
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You are now logged out");
    res.redirect("/");
});
// ----------------------------------------------------------

module.exports = router;