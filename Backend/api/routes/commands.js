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
    }).catch((err) => {
        res.status(404).json({
            message: "Enter Correct Project title!!"
        })
    })

})

module.exports = router