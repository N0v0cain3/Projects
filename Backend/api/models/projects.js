const mongoose = require("mongoose");
const User = require("./user");
const Comment = require("./comments")
const projectSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	tags: [{ type: String }],
	title: { type: String },
	description: { type: String },
	ideaBy: { type: String },
	timeline: {
		start: {
			type: Number,
			default: Date.now(),
		},
		review1: {
			type: Number,
			default: Date.now() + 10 * 24 * 60 * 60 * 1000,
		},
		review2: {
			type: Number,
			default: Date.now() + 20 * 24 * 60 * 60 * 1000,
		},
		review3: {
			type: Number,
			default: Date.now() + 30 * 24 * 60 * 60 * 1000,
		},
	},
	mentors: [
		{
			type: String,
		},
	],
	github: { type: String, default: "https://github.com/CodeChefVIT" },
	repo: { type: String },
	team: [
		{
			type: String,
		},
	],
	notification: { type: Number },
	photo: {
		type: String,
		default: "https://www.codechefvit.com/assets/images/logos/ccwhite.png"
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"

		}
	]
});

module.exports = mongoose.model("Project", projectSchema);
