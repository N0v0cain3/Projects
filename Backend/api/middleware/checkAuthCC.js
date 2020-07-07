const JWT = require("jsonwebtoken");

module.exports = function (req, res, next) {
	const token = req.header("auth-token");
	if (!token) return res.status(400).send("Access Denied!, no token entered");

	try {
		const verified = JWT.verify(token, "jwtpass");
		req.user = verified;
		// console.log(req.user);
		if (req.user.isCC == true) {
			next();
		} else {
			res.status(409).json({
				message: "not a CC member",
			});
		}
	} catch (err) {
		res.status(400).send({ error: "auth failed, check auth-token" });
	}
};
