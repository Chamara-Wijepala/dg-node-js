require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
	const token = authHeader.split(' ')[1];
	jwt.verify(
		token,
		// Had to put this in a template literal to solve issue with postman and
		// thunder client. Unclear if these tools are the cause of the issue.
		// This method might be unsafe
		`${process.env.ACCESS_TOKEN_SECRET}`,
		(err, decoded) => {
			if (err) return res.sendStatus(403);
			req.user = decoded.UserInfo.username;
			req.roles = decoded.UserInfo.roles;
			next();
		}
	);
};

module.exports = verifyJWT;
