const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length >= 1) {
				res.status(409).json({
					message: "Email already exists",
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err,
						});
					} else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							regNo: req.body.regno,
							email: req.body.email,
							password: hash,
							name: req.body.name,
						});
						user.save()
							.then((result) => {
								user.verifySignup = shortid.generate();
								user.verifyKeyExpires =
									new Date().getTime() + 20 * 60 * 1000;
								user.save()
									.then(async (result5) => {
										const msg = {
											to: req.body.email,
											from: "tempemail0609@gmail.com",
											subject: "Test",
											text: "Gg",
											html: `
                    <h1>Hi,</h1>
                    <h2>Welcome to Kaloory, Thank you for signing up</h2>
                    <h2>This email contains a email verification key, which you will need to enter in order to confirm your email address, please do not share this key with anyone.</h2>
                    <h2><code contenteditable="false" style="font-weight:200;font-size:1.5rem;padding:5px 10px; background: #EEEEEE; border:0">${user.verifySignup}</code></h2>
                    <h2>This signup key is valid for the next 20 minutes</h2>
                    `,
										};

										sgMail
											.send(msg)
											.then((result) => {
												console.log("key sent");
											})
											.catch((err) => {
												res.status(500).json({
													message:
														"something went wrong",
													error: err,
												});
											});
									})
									.catch((err) => {
										res.status(400).json({
											message: "Email Error",
										});
									});
								res.status(201).json({
									message: "User created",
									studentDetails: {
										studentId: result._id,
										email: result.email,
										name: result.name,
									},
								});
							})
							.catch((err) => {
								res.status(500).json({
									error: err,
								});
							});
					}
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});
router.post("/login", async (req, res) => {
	User.find({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length < 1) {
				return res.status(401).json({
					message: "Auth failed: Email not found probably",
				});
			}
			bcrypt.compare(
				req.body.password,
				user[0].password,
				(err, result) => {
					if (err) {
						return res.status(401).json({
							message: "Auth failed",
						});
					}
					if (result) {
						const token = jwt.sign(
							{
								userId: user[0]._id,
								email: user[0].email,
								name: user[0].name,
							},
							process.env.jwtSecret,
							{
								expiresIn: "1d",
							}
						);
						return res.status(200).json({
							message: "Auth successful",
							userDetails: {
								userId: user[0]._id,
								name: user[0].name,
								email: user[0].email,
							},
							token: token,
						});
					}
					res.status(401).json({
						message: "Auth failed1",
					});
				}
			);
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get("/", async (req, res) => {
	res.status(200).json({
		message: "ez",
	});
});

module.exports = router;
