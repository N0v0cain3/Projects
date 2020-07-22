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
//	const upload = require("../middleware/s3UploadClient")
require("dotenv").config();

router.get("/", async (req, res) => {

	let tags = []
	fetch(`https://api.github.com/repos/CodeChefVIT/CodeChefVIT20/languages`, {
		method: "get",
		headers: {
			'Accept': 'application/vnd.github.v3+json',
			"Content-Type": "application/json",
			'Authorization': 'Bearer ' + `${process.env.githubCCBot}`

		},
	})
		.then((res) => res.json())
		.then((json) => {
			//tags = json.names;
			console.log(json)
			res.status(200).json({
				json
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

// router.post(
// 	"/photo",
// 	upload.single("photo"),
// 	async (req, res) => {
// 		//checkAuth
// 		console.log(req.file.location);
// 		const photo = req.file.location;
// 		await Project.updateOne(
// 			{ _id: req.body.projectId },
// 			{
// 				$set: { photo: req.file.location },
// 			}
// 		)
// 			.then(async (result) => {
// 				res.status(201).json({
// 					message: "Created photo",
// 					url: photo,
// 				});
// 			})
// 			.catch((err) => {
// 				throw err;
// 			});
// 	}
// );

router.post("/add", async (req, res) => {
	//checkAuth checkAuthMod
	const title = req.body.title;
	const team = req.body.team;
	const ideaBy = req.body.ideaBy;
	const mentors = req.body.mentors;
	const start = req.body.start;
	const review1 = req.body.review1;
	const review2 = req.body.review2;
	const review3 = req.body.review3;
	const repo = req.body.repo;
	//let commits = []
	let description

	fetch(`https://api.github.com/repos/CodeChefVIT/${repo}/topics`, {
		method: "get",
		headers: {
			'Accept': 'application/vnd.github.mercy-preview+json',
			"Content-Type": "application/json",
			'Authorization': 'Bearer ' + `${process.env.githubCCBot}`

		},
	})
		.then((res) => res.json())
		.then((json) => {

			tags = json.names;
			console.log(tags);

		});



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
	// const response = await fetch(
	// 	`https://api.github.com/repos/CodeChefVIT/${repo}/commits`
	// );

	// const data = await response.json();
	// for (var i = 0; i < data.length; i++) {
	// 	console.log(data[i].commit.message);
	// 	commits.push(data[i].commit.message);
	// }

	const project = new Project({
		_id: new mongoose.Types.ObjectId(),
		title,
		description,
		mentors,
		github,
		timeline: { start, review1, review2, review3 },
		ideaBy,
		tags,
		repo,
		team,
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
		.then(async (project) => {
			let commits = []
			const repo = project.repo;
			const response = await fetch(
				`https://api.github.com/repos/CodeChefVIT/${repo}/commits`
			);
			const data = await response.json();
			for (var i = 0; i < data.length; i++) {
				console.log(data[i].commit.message);
				commits.push(data[i].commit.message);
			}
			res.status(200).json({ project, commits });
		})
		.catch((err) => res.status(400).json({ error: err.toString() }));
});


router.get("/:projectId/languages", async (req, res) => {
	Project.findById(req.params.projectId)
		.then(async (project) => {
			const repo = project.repo;

			fetch(`https://api.github.com/repos/CodeChefVIT/${repo}/languages`, {
				method: "get",
				headers: {
					'Accept': 'application/vnd.github.v3+json',
					"Content-Type": "application/json",
					'Authorization': 'Bearer ' + `${process.env.githubCCBot}`

				},
			})
				.then((res) => res.json())
				.then((json) => {
					//tags = json.names;
					console.log(json)
					res.status(200).json({
						json
					});
				});


		})
		.catch((err) => res.status(400).json({ error: err.toString() }));
});

//get team
router.get("/:projectId/team", async (rew, res) => {
	let name = [];
	Project.findById(req.params.projectId)
		.then((project) => {
			for (var i = 0; i < project.team.length; i++) {
				User.findOne({ reg: project.team[i] })
					.then((result) => {
						name.push(result.name);
					})
					.catch((err) =>
						res.status(400).json({ error: err.toString() })
					);
			}
			if (name) {
				res.status(200).json({
					name,
				});
			} else {
				res.status(404).json({
					message: "Not found",
				});
			}
		})
		.catch((err) => res.status(400).json({ error: err.toString() }));
});

//get mentors

router.get("/:projectId/mentors", async (rew, res) => {
	let name = [];
	Project.findById(req.params.projectId)
		.then((project) => {
			for (var i = 0; i < project.mentors.length; i++) {
				User.findOne({ reg: project.mentors[i] })
					.then((result) => {
						name.push(result.name);
					})
					.catch((err) =>
						res.status(400).json({ error: err.toString() })
					);
			}
			if (name) {
				res.status(200).json({
					name,
				});
			} else {
				res.status(404).json({
					message: "Not found",
				});
			}
		})
		.catch((err) => res.status(400).json({ error: err.toString() }));
});

router.get("/all", async (req, res) => {
	Project.find()

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

router.post("/:projectId/reminder", async (req, res) => {
	const recipientEmails = [];
	const recipientNames = [];
	const message = req.body.message;
	Project.findById(req.params.projectId)
		.then((project) => {
			for (var i = 0; i < project.team.length; i++) {
				User.findOne({ reg: project.team[i] })
					.then((result) => {
						recipientEmails.push(result.email);
						recipientNames.push(result.name);
					})
					.catch((err) =>
						res.status(400).json({ error: err.toString() })
					);
			}
			if (!recipientNames) {
				res.status(404).json({
					message: "Not found",
				});
			}
		})
		.catch((err) => res.status(400).json({ error: err.toString() }));

	const numRecipients = recipientEmails.length;

	for (var i = 0; i < numRecipients; i++) {
		let transporter = nodemailer.createTransport({
			service: "gmail",
			port: 465,
			auth: {
				user: process.env.email, // your gmail address
				pass: process.env.pass, // your gmail password
			},
		});
		let mailOptions = {
			subject: `Project Reminder`,
			to: recipientEmails[i],
			from: `CodeChef-VIT`,
			html: `
					<h1>${recipientNames[i]}</h1>
					<h2>Reminder for the project bitch</h2>
					${message}
                  `,
		};
		try {
			transporter.sendMail(mailOptions, (error, response) => {
				if (error) {
					//res.status(500).json("could not send ");
					console.log("fail ", mailOptions.to);
				} else {
					console.log("gg", mailOptions.to);
				}
			});
		} catch (error) {
			res.status(500).send("could not send");
		}
	}
});

module.exports = router;
