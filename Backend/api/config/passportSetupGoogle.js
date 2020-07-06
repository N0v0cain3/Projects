const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});
passport.use(
	new GoogleStrategy(
		{
			// options for google strategy
			clientID: process.env.clientID,
			clientSecret: process.env.clientSecret,
			callbackURL: "/auth/google/redirect",
		},
		(accessToken, refreshToken, profile, done) => {
			// check if user already exists in our own db
			console.log(profile);
			User.findOne({ googleId: profile.id }).then((currentUser) => {
				if (currentUser) {
					const token = jwt.sign(
						{
							userId: currentUser._id,
							email: currentUser.email,
							name: currentUser.name,
						},
						process.env.jwtSecret,
						{
							expiresIn: "1d",
						}
					);
					User.findById(currentUser._id)
						.then((result) => {
							result.token = token;
							result
								.save()
								.then((user) => {
									console.log("user: ", user);
									done(null, user);
								})
								.catch((err) => {
									done(err, result);
								});
						})
						.catch((err) => {
							done(err, result);
						});
				} else {
					// if not, create user in our db
					new User({
						_id: new mongoose.Types.ObjectId(),
						googleId: profile.id,
						name: profile.displayName,
						avatar: profile.photos[0].value,
						email: profile._json.email,
						isVerified: true,
					})
						.save()
						.then((newUser) => {
							const token = jwt.sign(
								{
									userId: newUser._id,
									email: newUser.email,
									name: newUser.name,
								},
								process.env.jwtSecret,
								{
									expiresIn: "1d",
								}
							);
							User.findById(newUser._id)
								.then((result) => {
									result.token = token;
									result
										.save()
										.then((user) => {
											console.log(
												"created new user: ",
												user
											);
											done(null, user);
										})
										.catch((err) => {
											done(err, result);
										});
								})
								.catch((err) => {
									done(err, result);
								});
						});
				}
			});
		}
	)
);
