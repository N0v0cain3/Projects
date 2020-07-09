const mongoose = require("mongoose");
const User = require("./user");
const ideaSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	tags: [
		{
			tag: { type: String },
		},
	],
	title: { type: String },
	description: { type: String, default: 0 },
	upvote: {
		count: { type: Number },
		user: [
			{
				type: mongoose.Schema.Types.ObjectID,
				ref: "User",
			},
		],
	},
	downvote: {
		count: { type: Number, default: 0 },
		user: [
			{
				type: mongoose.Schema.Types.ObjectID,
				ref: "User",
			},
		],
	},

	ideaBy: { type: String },
});

module.exports = mongoose.model("Idea", ideaSchema);
