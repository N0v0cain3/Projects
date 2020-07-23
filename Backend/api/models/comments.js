const mongoose = require("mongoose");
const User = require("./user");
const Project = require("./projects");
const Idea = require("./ideas")
const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    replyTo: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Comment",
    },
    by: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User",
    },
    text: {
        type: String
    },
    time: {
        type: Date,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Project"
    },


});

module.exports = mongoose.model("Comment", commentSchema);
