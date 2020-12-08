const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const passportSetup = require("./Backend/api/config/passportSetupGoogle");
const passport = require("passport");

const app = express();
app.use(cors());
const userRoutes = require("./Backend/api/routes/user");
const authRoutes = require("./Backend/api/routes/auth");
const ideaRoutes = require("./Backend/api/routes/ideas");
const projectRoutes = require("./Backend/api/routes/projects");
const commandRoutes = require("./Backend/api/routes/commands")
//===============Database========================
const dbURI = process.env.mongoUrl;

mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Database Connected"))
	.catch((err) => console.log(err));
//===============================================

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
//===============================================
mongoose.Promise = global.Promise;
//routes that handle requests
//=========================================
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/idea", ideaRoutes);
app.use("/commands", commandRoutes);
//=========================================

app.use((req, res, next) => {
	const error = new Error("Request Not found sorry!");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

const PORT = process.env.PORT || 3000;

console.log(Number(Date.now()) + Number(10 * 24 * 60 * 60 * 1000));
// var date = new Date(1594989162860);
// console.log(date.toLocaleString());
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
