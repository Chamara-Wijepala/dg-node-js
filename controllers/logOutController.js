const fsPromises = require('fs').promises;
const path = require('path');
const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) {
		this.users = data;
	},
};

const handleLogOut = async (req, res) => {
	// on client, also delete access token

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); // No content

	const refreshToken = cookies.jwt;

	// is refresh token in db?
	const foundUser = usersDB.users.find(
		(person) => person.refreshToken === refreshToken
	);
	if (!foundUser) {
		// when clearing cookies, the maxAge property is not required to match
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		return res.sendStatus(204);
	}

	// delete refresh token
	const otherUsers = usersDB.users.filter(
		(person) => person.refreshToken !== foundUser.refreshToken
	);
	const currentUser = { ...foundUser, refreshToken: '' };
	usersDB.setUsers([...otherUsers, currentUser]);
	await fsPromises.writeFile(
		path.join(__dirname, '..', 'model', 'users.json'),
		JSON.stringify(usersDB.users)
	);

	// In production, when sending and deleting cookies, add "flag secure: true"
	// which will serve on https instead of http
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
	res.sendStatus(204);
};

module.exports = { handleLogOut };
