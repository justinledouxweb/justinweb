require('newrelic');

const express = require('express');
const server = require('./server.js');
const compression = require('compression');
const favicon = require('serve-favicon');
const hdb = require('express-handlebars').create();

const app = express();
app.engine('handlebars', hdb.engine);

// App setup environment port
app.set('port', process.env.PORT);
app.enable('trust proxy');
// app.use( i18n.init )

app.use(compression());
app.use(express.static(`${__dirname}/public/`, { maxage: 0, etag: false }));
app.use(favicon(`${__dirname}/public/favicon.ico`));

app.use((req, res, next) => {
  res.locals.isProduction = process.env.NODE_ENV === 'production';
  next();
});

require('./routes.js')(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
});

app.use((err, req, res, next) => {
  if (req.xhr) res.status(500).json({ error: err.stack });
  next();
});

// start the server in cluster
if (require.main === module) server(app);
else module.exports = server(app);

module.exports = app;
