'use strict'

const pages = require('./handlers/pages.js');

module.exports = app => {
	app.get('/download/cv', 	pages.downloadCV);
}
