const mongoose = require("mongoose");
const User = require("./user");
const projectSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	tags: [
		{
			tag: { type: String },
		},
	],
	title: { type: String },
	description: { type: String },
	ideaBy: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
	timeline: {
		start: {
			type: Number,
			default: Date.now(),
		},
		review1: {
			type: Number,
			default: Date.now() * 10 * 24 * 60 * 60 * 1000,
		},
		review2: {
			type: Number,
			default: Date.now() * 20 * 24 * 60 * 60 * 1000,
		},
		review3: {
			type: Number,
			default: Date.now() * 30 * 24 * 60 * 60 * 1000,
		},
	},
});

module.exports = mongoose.model("Project", projectSchema);
