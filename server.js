const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');

const app = express();
const PORT = process.env.PORT || 5000;

// custom middleware logger
app.use(logger);

// Must be before cors.
app.use(credentials);

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data (form data)
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.use(cookieParser());

// serve static files, css, images etc.
app.use(express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logOut'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

/*

app.get(
	'/hello(.html)?',
	(req, res, next) => {
		console.log('attempted to load hello.html');
		// when next is called it calls the next function in the chain
		next();
	},
	(req, res) => {
		res.send('Hello World!');
	}
);

const one = (req, res, next) => {
	console.log('one');
	next();
};
const two = (req, res, next) => {
	console.log('two');
	next();
};
const three = (req, res) => {
	console.log('three');
	res.send('Finished');
};

app.get('/chain(.html)?', [one, two, three]);

*/

app.all('*', (req, res) => {
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({ error: '404 not found' });
	} else {
		res.type('txt').send('404 not found');
	}
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
