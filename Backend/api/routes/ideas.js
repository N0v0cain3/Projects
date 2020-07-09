const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const Idea = require("../models/ideas");
const checkAuth = require("../middleware/checkAuth");
require("dotenv").config();
const router = express.Router();
module.exports = router;

router.post("/add", checkAuth, async (req, res) => {
	const title = req.body.title;
	const ideaBy = req.body.ideaBy;
	const description = req.body.description;
	const tags = req.body.tags;

	const idea = new Idea({
		_id: new mongoose.Types.ObjectId(),
		title,
		description,
		ideaBy,
		tags,
	});
	idea.save().then((result) => {
		res.status(201).json({
			message: "Idea Created",
			ideaDetails: {
				title: result.title,
				desc: result.description,
				ideaBy: result.ideaBy,
				tags: result.tags,
			},
		});
	});
});

router.delete("/delete", checkAuth, async (req, res) => {
	Idea.deleteOne({ _id: req.body.ideaId })
		.then((result) => {
			res.status(204).json({ message: "Succesfully Deleted" });
		})
		.catch((err) => {
			res.status(500).json({ error: err.toString() });
		});
});

router.get("/all", async (req, res) => {
	Idea.find()
		.then((result) => {
			res.status(200).json({ result });
		})
		.catch((err) => res.status(400).json({ error: err.toString() }));
});
