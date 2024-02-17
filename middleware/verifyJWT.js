require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader) return res.sendStatus(401);
	console.log(authHeader);
	const token = authHeader.split(' ')[1];
	jwt.verify(
		token,
		// Had to put this in a template literal to solve issue with postman and
		// thunder client. Unclear if these tools are the cause of the issue.
		// This method might be unsafe
		`${process.env.ACCESS_TOKEN_SECRET}`,
		(err, decoded) => {
			if (err) return res.sendStatus(403);
			req.user = decoded.username;
			next();
		}
	);
};

module.exports = verifyJWT;
