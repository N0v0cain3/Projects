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
		count: { type: Number },
		user: [
			{
				type: mongoose.Schema.Types.ObjectID,
				ref: "User",
			},
		],
	},
});

module.exports = mongoose.model("User", userSchema);
