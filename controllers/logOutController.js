const User = require('../model/User');

const handleLogOut = async (req, res) => {
	// on client, also delete access token

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); // No content

	const refreshToken = cookies.jwt;

	// is refresh token in db?
	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) {
		// when clearing cookies, the maxAge property is not required to match
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		return res.sendStatus(204);
	}

	// delete refresh token
	foundUser.refreshToken = '';
	const result = await foundUser.save();
	console.log(result);

	// In production, when sending and deleting cookies, add "flag secure: true"
	// which will serve on https instead of http
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
	res.sendStatus(204);
};

module.exports = { handleLogOut };
