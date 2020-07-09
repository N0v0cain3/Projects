const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const Project = require("../models/projects");
const checkAuth = require("../middleware/checkAuth");
const checkAuthMod = require("../middleware/checkAuthMod");
const checkAuthCC = require("../middleware/checkAuthCC");
const projects = require("../models/projects");
const router = express.Router();
require("dotenv").config();

router.post("/add", checkAuth, checkAuthMod, async (req, res) => {
	const title = req.body.title;
	const ideaBy = req.body.ideaBy;
	const description = req.body.description;
	const mentors = req.body.mentors;
	const start = req.body.start;
	const review1 = req.body.review1;
	const review2 = req.body.review2;
	const review3 = req.body.review3;
	const tags = req.body.tags;
	const github = req.body.github;

	const project = new Project({
		_id: new mongoose.Types.ObjectId(),
		title,
		description,
		mentors,
		github,
		timeline: { start, review1, review2, review3 },
		ideaBy,
		tags,
	});
	project.save().then((result) => {
		res.status(201).json({
			message: "Project Created",
			projectDetails: {
				title: result.title,
				desc: result.description,
				mentors: result.mentors,
				timeline: result.timeline,
				ideaBy: result.ideaBy,
				tags: result.tags,
			},
		});
	});
});

router.delete("/delete", checkAuth, checkAuthMod, async (req, res) => {
	Project.deleteOne({ _id: req.body.projectId })
		.then((result) => {
			res.status(204).json({ message: "Succesfully Deleted" });
		})
		.catch((err) => {
			res.status(500).json({ error: err.toString() });
		});
});

router.get("/all", async (req, res) => {
	Project.find()
		.then((result) => {
			res.status(200).json({ result });
		})
		.catch((err) => res.status(400).json({ error: err.toString() }));
});

module.exports = router;
