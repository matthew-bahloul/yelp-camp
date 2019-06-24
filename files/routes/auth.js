const express = require("express");
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");

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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
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

module.exports = router;