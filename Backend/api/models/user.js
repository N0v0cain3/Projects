const mongoose = require("mongoose");
const Idea = require("./ideas")
const userSchema = mongoose.Schema({
	googleId: { type: String },
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	token: { type: String },
	email: {
		type: String,
		required: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	},
	isVerified: { type: Boolean, default: false },
	avatar: {
		type: String,
	},
	isCC: {
		type: Boolean,
		default: false,
	},
	isModerator: {
		type: Boolean,
		default: false,
	},
	reg: {
		type: String,
		default: "NA",
	},
	vote: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Idea"
	}]
});

module.exports = mongoose.model("User", userSchema);
