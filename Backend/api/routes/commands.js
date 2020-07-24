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
const Comment = require("../models/comments")
const checkAuth = require("../middleware/checkAuth");
const checkAuthMod = require("../middleware/checkAuthMod");
const checkAuthCC = require("../middleware/checkAuthCC");
const projects = require("../models/projects");
const router = express.Router();
//	const upload = require("../middleware/s3UploadClient")
require("dotenv").config();


router.post("/", async (req, res) => {
    title = req.body.title;
    repo = req.body.repo;
    command = req.body.command;
    await Project.findOne({ title: title }).then((project) => {
        if (command == `delete`) {
            Project.deleteMany({ title: title })
                .then((result) => {
                    res.status(200).json({ message: "Succesfully Deleted" });
                })
                .catch((err) => {
                    res.status(500).json({ error: err.toString() });
                });
        }

        else if (command == "/clearall") {

            Comment.deleteMany({ projectId: project._id }).then(() => {
                res.status(202).json({
                    message: "Deleted"
                })
            }).catch((err) => {
                res.status(500).json({
                    message: "Unable to delete comments"
                })
            })
        }
        else if (command == `add project`) {

            fetch(`https://api.github.com/repos/CodeChefVIT/${repo}/topics`, {
                method: "get",
                headers: {
                    'Accept': 'application/vnd.github.mercy-preview+json',
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + `${process.env.githubCCBot}`

                },
            })
                .then((res) => res.json())
                .then(async (json) => {

                    tags = json.names

                    //console.log(tags);

                }).then(() => {
                    console.log(tags)
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

                        }).then(() => {
                            console.log(description)

                            const github = `https://github.com/CodeChefVit/${repo}`;


                            const project = new Project({
                                _id: new mongoose.Types.ObjectId(),
                                description,
                                github,
                                tags,
                                repo,

                            });
                            project.save().then((result) => {
                                res.status(201).json({
                                    message: "Project Created",
                                    projectDetails: {
                                        _id: result._id,
                                        repo: result.repo,
                                        desc: result.description,
                                        repo: result.repo,
                                        topics: result.tags,
                                        github: result.github
                                    },
                                });
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


                });
        }

    }).catch((err) => {
        res.status(404).json({
            message: "Enter Correct Project title!!"
        })
    })

})

module.exports = router