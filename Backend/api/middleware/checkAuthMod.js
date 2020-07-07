const JWT = require("jsonwebtoken");
const User = require("../models/user");
module.exports = function (req, res, next) {
	const token = req.header("auth-token");
	if (!token) return res.status(400).send("Access Denied!, no token entered");

	try {
		const verified = JWT.verify(token, "enimasinobhaniyo");
		req.user = verified;
		console.log(req.user);
		User.findById(req.user.userId)
			.then((result) => {
				if (result.isModerator == true) {
					next();
				} else {
					res.status(409).json({
						message: "not a Moderator",
					});
				}
			})
			.catch((err) => {
				res.status(500).json({ error: err.toString() });
			});
	} catch (err) {
		res.status(400).send({ error: "auth failed, check auth-token" });
	}
};
