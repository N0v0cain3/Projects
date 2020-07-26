const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const Idea = require("../models/ideas");
const Comment = require("../models/comments")
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
				_id: result._id,
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

router.get("/:ideaId", async (req, res) => {
	Idea.findById(req.params.ideaId).then((idea) => {
		res.status(200).json({
			idea
		})
	}).catch((err) => res.status(400).json({ error: err.toString() }));
})

//update idea

router.patch("/update/:ideaId", async (req, res, next) => {
	const id = req.params.ideaId;
	var flag = 0;

	Idea.updateOne({ _id: id }, { $set: req.body })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: "Ideas updated",
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.patch("/vote", checkAuth, async (req, res) => {
	const ideaId = req.body.ideaId;
	const vote = req.body.vote;
	var count
	if (vote == "upvote") {
		await Idea.findById(ideaId).then(async (idea) => {
			count = idea.upvote.count;
			count++;
			await Idea.updateOne({ _id: ideaId }, { $set: { "upvote": { count: count } } })
				//  { $push: { "upvote.$.user": req.user.userId } }, 
				.then(async () => {
					await Idea.updateOne({ _id: ideaId }, { $push: { "upvote.user": req.user.userId } }).then(() => {
						res.status(200).json({
							message: "Voted"
						})
					}).catch((err) => {
						res.status(400).json({
							error: err.toString()
						})
					})

				}).catch((err) => {
					res.status(400).json({
						error: err.toString()
					})
				})
		}).catch((err) => {
			res.status(500).json({
				error: err.toString(),
			});
		});
	}
	else if (vote == "downvote") {
		{
			await Idea.findById(ideaId).then(async (idea) => {
				count = idea.downvote.count;
				count++;
				await Idea.updateOne({ _id: ideaId }, { $set: { "downvote": { count: count } } })
					//  { $push: { "downvote.$.user": req.user.userId } }, 
					.then(async () => {
						await Idea.updateOne({ _id: ideaId }, { $push: { "downvote.user": req.user.userId } }).then(() => {
							res.status(200).json({
								message: "Voted"
							})
						}).catch((err) => {
							res.status(400).json({
								error: err.toString()
							})
						})

					}).catch((err) => {
						res.status(400).json({
							error: err.toString()
						})
					})
			}).catch((err) => {
				res.status(500).json({
					error: err.toString(),
				});
			});
		}
	}
	else {
		res.status(400).json({
			message: "Invalid vote"
		})
	}
})

//comments
router.post("/comment", checkAuth, async (req, res) => {
	const comment = new Comment({
		_id: new mongoose.Types.ObjectId(),
		by: req.user.userId,
		text: req.body.text,
		time: Date.now(),
		ideaId: req.body.ideaId,
		replyTo: req.body.replyTo
	});
	comment.save().then((result) => {

		Idea.updateOne({ _id: req.body.ideaId }, { $push: { comments: result._id } })
			.then(() => {
				res.status(201).json({
					message: "comment Created",
					commentDetails: {
						_id: result._id,
						by: result.by,
						text: result.text,
						time: result.time,
						ideaId: result.ideaId,
						replyTo: result.replyTo
					},
				});
			}).catch((err) => {
				res.status(500).json({
					error: err.toString()
				})
			})


	}).catch((err) => {
		res.status(400).json({
			error: err.toString()
		})
	})
})

router.get("/:ideaId/comments", async (req, res) => {
	const ideaId = req.params.ideaId
	Idea.findOne({ _id: ideaId })
		.populate("comments")
		.then((idea) => {
			res.status(200).json({
				comments: idea.comments
			})
		}).catch((err) => {
			res.status(500).json({
				error: err.toString()
			})
		})
})

module.exports = router;
