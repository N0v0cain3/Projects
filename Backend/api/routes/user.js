const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const checkAuth = require("../middleware/checkAuth");
const { getMaxListeners } = require("../models/user");
require("dotenv").config();

const router = express.Router();

router.get("/", async (req, res) => {
	res.status(200).json({
		message: "ez",
	});
});

module.exports = router;
