const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const checkAuth = require("../middleware/checkAuth");

require("dotenv").config();

const router = express.Router();

router.patch("/checkCC", checkAuth, async (req, res) => {
	if (req.body.key == process.env.cckey) {
		console.log(req.user);
		await User.updateOne({ _id: req.user.userId }, { $set: { isCC: true } })
			.then(async (result) => {
				await User.findOne({ _id: req.user.userId })
					.then((result1) => res.status(200).json({ result1 }))
					.catch((err) => {
						error: err.toString();
					});
			})
			.catch((err) => {
				res.status(500).json({
					error: err.toString(),
				});
			});
	}
});

router.patch("/checkmod", checkAuth, async (req, res) => {
	console.log(req.user);
	if (req.body.key == process.env.modkey) {
		await User.updateOne(
			{ _id: req.user.userId },
			{ $set: { isCC: true, isModerator: true } }
		)
			.then((result) => {
				res.status(200).json({
					message: "Added successfully",
				});
			})
			.catch((err) => {
				res.status(500).json({
					error: err.toString(),
				});
			});
	}
});

router.patch("/details", checkAuth, async (req, res) => {
	User.updateOne({ _id: req.user.userId }, { $set: { reg: req.body.reg } })
		.then((result) => {
			res.status(200).json({
				message: "RegNo added",
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err.toString(),
			});
		});
});

router.get("/", async (req, res) => {
	res.status(200).json({
		message: "ez",
	});
});

module.exports = router;
