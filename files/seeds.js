const mongoose = require("mongoose");               // for database
const Campground = require("./models/campground");  // to create a campground
const Comment = require("./models/comment");        // to create a comment

var data = [
    {   name: "Matthew's Peak",
        image: "https://images.unsplash.com/photo-1475564481606-0f9f5d97c047?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        description: "Bacon ipsum dolor amet jerky tenderloin porchetta capicola shankle strip steak landjaeger. Andouille short loin swine t-bone. Porchetta kevin doner filet mignon pig landjaeger cupim corned beef salami frankfurter. Flank bacon meatball bresaola shank shoulder. Biltong pork belly ribeye salami kevin capicola. Jerky boudin jowl andouille capicola filet mignon chuck bacon pork chop tri-tip pastrami spare ribs shoulder pork belly."
    },
    {   name: "Bahloul Creek", 
        image: "https://images.unsplash.com/photo-1467357689433-255655dbce4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1056&q=80", 
        description: "Bacon ipsum dolor amet jerky tenderloin porchetta capicola shankle strip steak landjaeger. Andouille short loin swine t-bone. Porchetta kevin doner filet mignon pig landjaeger cupim corned beef salami frankfurter. Flank bacon meatball bresaola shank shoulder. Biltong pork belly ribeye salami kevin capicola. Jerky boudin jowl andouille capicola filet mignon chuck bacon pork chop tri-tip pastrami spare ribs shoulder pork belly." 
    },
    {   name: "Hyrule Field", 
        image: "https://images.unsplash.com/photo-1558378680-2a12686d2457?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80", 
        description: "Bacon ipsum dolor amet jerky tenderloin porchetta capicola shankle strip steak landjaeger. Andouille short loin swine t-bone. Porchetta kevin doner filet mignon pig landjaeger cupim corned beef salami frankfurter. Flank bacon meatball bresaola shank shoulder. Biltong pork belly ribeye salami kevin capicola. Jerky boudin jowl andouille capicola filet mignon chuck bacon pork chop tri-tip pastrami spare ribs shoulder pork belly." 
    },
    {   name: "Oasis Landing", 
        image: "https://images.unsplash.com/photo-1526375621164-c20d519c1d5f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=968&q=80", 
        description: "Bacon ipsum dolor amet jerky tenderloin porchetta capicola shankle strip steak landjaeger. Andouille short loin swine t-bone. Porchetta kevin doner filet mignon pig landjaeger cupim corned beef salami frankfurter. Flank bacon meatball bresaola shank shoulder. Biltong pork belly ribeye salami kevin capicola. Jerky boudin jowl andouille capicola filet mignon chuck bacon pork chop tri-tip pastrami spare ribs shoulder pork belly." 
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.deleteMany({}, (err) => {
            if (err) {
                console.log(err);
            }
            console.log("removed comments!");
            //add a few campgrounds
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, (err, comment) => {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });
}

//---------------------------------------------------------------------
module.exports = seedDB; // to make overall project more modular