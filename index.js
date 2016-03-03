'use strict'

const ENV = process.env.NODE_ENV

const express 					= require( 'express' ),
			app 							= express(),
			server						=	require( './server.js' ),
			bodyParser 				= require( 'body-parser' ),
			csurf 						= require( 'csurf' ),
			handlebars 				= require( 'express-handlebars' ),
			handlebarsConfig 	= require( './handlebars-config.js' ),
			cookieParser 			= require( 'cookie-parser' ),
			session 					= require( 'client-sessions' ),
			mongoose 					= require( 'mongoose' ),
			compression 			= require( 'compression' ),
			// i18n 							= require( 'i18n' ),
			formidable 				= require( 'formidable' ),
			flash 						= require( 'connect-flash' ),
			config 						= require( './config.js' )[ ENV ],
			favicon 					= require( 'serve-favicon' ),
			fs 								= require( 'fs' ),
			criticalCss 			= fs.readFileSync( './public/css/critical.css', 'utf8' )

// mongoose.connect(
// 	config.mongodb.connectionString,
// 	config.mongodb.options )

// mongoose.connection.on( 'error', err => {
// 	console.error( 'MongoDB is not running. Please launch MongoDB before continuing.' )
// 	return
// })

// i18n.configure({
// 	locales: 	[ 'en', 'fr' ],
// 	cookie: 	'i18n'
// })

const hdb = handlebars.create( handlebarsConfig.handlebars )
app.engine( 'handlebars', hdb.engine )
app.set( 'view engine', 'handlebars' )
app.set( 'view options', {
	layout: 'main.handlebars'
})

// App setup environment port
app.set( 'port', process.env.PORT || 5000 )
app.enable( 'trust proxy' )
// app.use( i18n.init )
app.use( bodyParser.urlencoded({ extended: true }) )
app.use( bodyParser.json() )
app.use( cookieParser( process.env.COOKIE_KEY ) )
app.use( session({
	cookieName: 		'session',
	secret: 				process.env.SESSION_KEY,
	duration: 			7 * 24 * 60 * 60 * 1000, // 7 days
	activeDuration: 1 * 24 * 60 * 60 * 1000, // 1 day
	httpOnly: 			true, // don't let javascript access coockies ever
	secure: 				true, // only use coockies over https
}))
app.use( session({
	cookieName: 'eocFormData',
	secret: process.env.SESSION_KEY,
	secure: true, // only use coockies over https
}))
app.use( flash() )
app.use( ( req, res, next ) => {
	const regex = new RegExp( 'multipart/form-data' )

	if ( regex.test( req.headers[ 'content-type' ] ) ) {
		let form = new formidable.IncomingForm()

		form.multiples = true
		form.parse( req, ( err, fields, files ) => {
			if ( err ) return console.error( err )

	    req.files = files
			req.body = fields
			next()
	  })
	}

	else {
		next()
	}
})

app.use( csurf() )
app.use( compression() )
app.use( express.static( `${__dirname}/public/`, { maxage: 2629746000, etag: true } ) )
app.use( favicon( `${__dirname}/public/favicon.ico` ) )

app.use( ( req, res, next ) => {
	res.locals.baseURL 							= config.baseURL
	res.locals.staticResourcesPath 	= config.staticResourcesBaseURL
	// res.locals.uploadedFilePath 		= config.uploadBaseURL
	res.locals.jqueryPath 					= config.jQuery
	// res.locals.jqueryPathIE8 				= config.IE8jQuery
	// res.locals.jqueryUIPath 				= config.jqueryUIPath
	res.locals.csrfToken 						= req.csrfToken()
	res.locals.criticalCss 					= criticalCss
	// res.locals.flash 								= req.flash( 'flash' )[0]
	// res.locals.froalaKey 						= config.froalaLicense
	res.locals.isProduction 				= process.env.NODE_ENV === 'production'

	next()
})

// routes
require( './routes.js' )( app )

app.use( ( err, req, res, next ) => {
	// log errors
	let error = null

	if ( ENV === 'development' || ENV === 'local' ) {
		error = err

		console.error( err )
		console.error( err.name )
		console.error( err.message )
		console.error( err.stack )
	}

	res.status( err.status || 500 )
	res.render( '500', {
		message: 	err.message,
		error: 		error
	})
})

app.use( ( req, res, next ) => {
  res.status( 404 )
  res.render( '404' )
})

// start the server in cluster
if ( require.main === module ) {
	server( app )
}

else {
	module.exports = server( app )
}

module.exports = app