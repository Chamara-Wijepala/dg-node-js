const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message) => {
	const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
	const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
	console.log(logItem);
	try {
		// create logs directory if it doesn't exist
		if (!fs.existsSync(path.join(__dirname, 'logs'))) {
			await fsPromises.mkdir(path.join(__dirname, 'logs'));
		}
		// appendFile creates a new file if it doesn't exist, but it won't create
		// a new directory
		await fsPromises.appendFile(
			path.join(__dirname, 'logs', 'eventLog.txt'),
			logItem
		);
	} catch (err) {
		console.error(err);
	}
};

module.exports = logEvents;
