'use strict';

const ENV = process.env.NODE_ENV;

const express = require('express');
const app = express();
const server =	require('./server.js');
const compression = require('compression');
const config = require('./config.js')[ENV];
const favicon = require('serve-favicon');
const fs = require('fs');

// i18n.configure({
//  locales:  [ 'en', 'fr' ],
//  cookie:   'i18n'
// })

let hdb = require('express-handlebars').create();
app.engine('handlebars', hdb.engine);

// App setup environment port
app.set('port', process.env.PORT);
app.enable('trust proxy');
// app.use( i18n.init )

app.use(compression());
app.use(express.static(`${__dirname}/public/`, config.staticResourceCache));
app.use(favicon(`${__dirname}/public/favicon.ico`));

app.use((req, res, next) => {
	res.locals.isProduction = process.env.NODE_ENV === 'production';
	next();
});

require( './routes.js' )(app);

app.use(function logErrors(err, req, res, next) {
	console.error(err.stack);
	next(err);
});

app.use(function clientErrorHandler( err, req, res, next ) {
	if (req.xhr) res.status(500).json({ error: err.stack });
	next();
});

// start the server in cluster
if (require.main === module) server(app);
else module.exports = server(app);

module.exports = app;
