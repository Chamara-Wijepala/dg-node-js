const bcrypt = require('bcrypt');
const User = require('../model/User');

const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		return res
			.status(400)
			.json({ message: 'Username and password are required' });

	// check for duplicate usernames in db
	// if using a method without async/await and without passing in a callback
	// the exec function must be chained.
	const duplicate = await User.findOne({ username: user }).exec();

	if (duplicate) return res.sendStatus(409);

	try {
		// encrypt password
		const hashedPwd = await bcrypt.hash(pwd, 10);

		// create and store new user
		const result = await User.create({
			username: user,
			password: hashedPwd,
		});

		console.log(result);

		res.status(201).json({ success: `New user ${user} created` });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { handleNewUser };
