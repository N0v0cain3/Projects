const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();

const passportSetup = require("./api/config/passportSetupGoogle");
const passport = require("passport");

const app = express();
const userRoutes = require("./api/routes/user");
const authRoutes = require("./api/routes/auth");
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
app.use(cors());
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
//=========================================

app.use((req, res, next) => {
	const error = new Error("Request Not found sorry!");
	error.status = 404;
	next(error);
});

// app.use((error, req, res, next) => {
// 	res.status(error.status || 500);
// 	res.json({
// 		error: {
// 			message: error.message,
// 		},
// 	});
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
