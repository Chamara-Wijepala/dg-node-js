const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		// this header is required when using fetch, otherwise it causes cors error
		res.header('Access-Control-Allow-Credentials', true);
	}
	next();
};

module.exports = credentials;
