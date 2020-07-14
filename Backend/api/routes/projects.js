const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const User = require("../models/user");
const Project = require("../models/projects");
const checkAuth = require("../middleware/checkAuth");
const checkAuthMod = require("../middleware/checkAuthMod");
const checkAuthCC = require("../middleware/checkAuthCC");
const projects = require("../models/projects");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
	fetch(`https://api.github.com/repos/CodeChefVit/Projects`, {
		method: "get",
		headers: {
			"Content-Type": "application/json",
			Authorization: `${process.env.githubCCBot}`,
		},
	})
		.then((res) => res.json())
		.then((json) => {
			res.status(200).json({
				json,
			});
		});

	//		issue:json.open_issues_count
	//description:json.description
	//    "created_at": "2020-07-05T12:23:15Z",
	//	  "updated_at": "2020-07-12T17:40:14Z",
	//	  "pushed_at": "2020-07-12T17:40:11Z",
	//"language": "JavaScript",
	//"git_url": "git://github.com/CodeChefVIT/Projects.git",
	//
});

router.post("/add", async (req, res) => {
	//checkAuth checkAuthMod
	const title = req.body.title;
	//const team = req.body.team;
	const ideaBy = req.body.ideaBy;
	//const description = req.body.description;
	const mentors = req.body.mentors;
	const start = req.body.start;
	const review1 = req.body.review1;
	const review2 = req.body.review2;
	const review3 = req.body.review3;
	const repo = req.body.repo;
	//const tags = req.body.tags;
	let commits = [];

	fetch(`https://api.github.com/repos/CodeChefVit/${repo}`, {
		method: "get",
		headers: {
			"Content-Type": "application/json",
			Authorization: `${process.env.githubCCBot}`,
		},
	})
		.then((res) => res.json())
		.then((json) => {
			description = json.description;
		});

	const github = `https://github.com/CodeChefVit/${repo}`;
	const response = await fetch(
		`https://api.github.com/repos/CodeChefVIT/${repo}/commits`
	);

	const data = await response.json();
	for (var i = 0; i < data.length; i++) {
		console.log(data[i].commit.message);
		commits.push(data[i].commit.message);
	}

	const project = new Project({
		_id: new mongoose.Types.ObjectId(),
		title,
		description,
		mentors,
		github,
		timeline: { start, review1, review2, review3 },
		ideaBy,
		//		tags,
		commits,
		repo,
		//team,
	});
	project.save().then((result) => {
		res.status(201).json({
			message: "Project Created",
			projectDetails: {
				_id: result._id,
				title: result.title,
				desc: result.description,
				repo: result.repo,
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

router.get("/:projectId", async (req, res) => {
	Project.findById(req.params.projectId)
		.then((result) => {
			res.status(200).json({ result });
		})
		.catch((err) => res.status(400).json({ error: err.toString() }));
});

router.get("/all", async (req, res) => {
	Project.find()
		.populate({ path: "team" })
		.then((result) => {
			res.status(200).json({ result });
		})
		.catch((err) => res.status(400).json({ error: err.toString() }));
});

//update project
router.patch("/update/:projectId", async (req, res, next) => {
	const id = req.params.projectId;
	const updateOps = {};
	var flag = 0;

	Project.updateOne({ _id: id }, { $set: req.body })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: "Project updated",
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

//get commits of a repo
router.get("/commits/:projectId", async (req, res) => {
	Project.findById(req.params.projectId)
		.then(async (result) => {
			const response = await fetch(
				`https://api.github.com/repos/CodeChefVIT/${result.repo}/commits`
			);
			let commits = [];
			const data = await response.json();
			for (var i = 0; i < data.length; i++) {
				commits.push(data[i].commit.message);
			}

			res.status(200).json(commits);
		})
		.catch((err) => res.status(400).json({ error: err.toString() }));
});

module.exports = router;
