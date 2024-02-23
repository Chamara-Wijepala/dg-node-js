const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		return res
			.status(400)
			.json({ message: 'Username and password are required' });

	// find user in db
	const foundUser = await User.findOne({ username: user }).exec();
	if (!foundUser) return res.sendStatus(401);

	// evaluate password
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (match) {
		// get the codes of each role
		const roles = Object.values(foundUser.roles);
		// create JWTs
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
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		// save current user with refresh token to db
		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();
		console.log(result);

		// httpOnly cookies aren't accessible to javascript
		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({ accessToken });
	} else {
		res.sendStatus(401);
	}
};

module.exports = { handleLogin };
