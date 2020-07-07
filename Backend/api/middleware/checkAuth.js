const JWT = require("jsonwebtoken");

module.exports = function (req, res, next) {
	const token = req.header("auth-token");
	if (!token) return res.status(400).send("Access Denied!, no token entered");

	try {
		const verified = JWT.verify(token, process.env.jwtSecret);

		req.user = verified;
		console.log(req.user, verified);
		next();
		// console.log(next);
	} catch (err) {
		res.status(400).send({ error: err.toString() });
	}
};
