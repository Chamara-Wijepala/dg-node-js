const jwt = require('jsonwebtoken');
const User = require('../model/User');

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) return res.sendStatus(403); // Forbidden

	// evaluate jwt
	jwt.verify(
		refreshToken,
		// Had to put this in a template literal to solve issue with postman and
		// thunder client. Unclear if these tools are the cause of the issue.
		// This method might be unsafe
		`${process.env.REFRESH_TOKEN_SECRET}`,
		(err, decoded) => {
			if (err || foundUser.username !== decoded.username)
				return res.sendStatus(403);
			// get the codes of each role
			const roles = Object.values(foundUser.roles);
			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: foundUser.username,
						roles: roles,
					},
				},
				// Had to put this in a template literal to solve issue with postman and
				// thunder client. Unclear if these tools are the cause of the issue.
				// This method might be unsafe
				`${process.env.ACCESS_TOKEN_SECRET}`,
				{ expiresIn: '5m' }
			);
			res.json({ accessToken });
		}
	);
};

module.exports = { handleRefreshToken };
