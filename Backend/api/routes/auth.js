const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);
///Callback route for google to redirect
router.get(
	"/google/redirect",
	passport.authenticate("google"),
	(req, res, next) => {
		console.log("req.user:", req.user);
		req.session.context = req.user;
		const x = req.user;
		var token = encodeURIComponent(req.user.token);
		var name = encodeURIComponent(req.user.name);
		res.send(req.user);
		res.redirect(303, "https://www.google.com" + name + "&token=" + token);
	}
);
module.exports = router;
