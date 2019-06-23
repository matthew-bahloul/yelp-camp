const mongoose = require("mongoose");

// create the schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// compile the schema into a model?
var Campground = mongoose.model("Campground", campgroundSchema);


// export with module.exports
module.exports = mongoose.model("Campground", campgroundSchema);