var express 					= require( 'express' ),
		app 							= express(),
		server						=	require( './server.js' ),
		bodyParser 				= require( 'body-parser' ),
		csurf 						= require( 'csurf' ),
		handlebars 				= require( 'express-handlebars' ),
		handlebarsConfig 	= require( './handlebars-config.js' ),
		cookieParser 			= require( 'cookie-parser' ),
		session 					= require( 'client-sessions' ),
		mongoose 					= require( 'mongoose' ),
		// i18n 							= require( 'i18n' ),
		formidable 				= require( 'formidable' ),
		flash 						= require( 'connect-flash' ),
		config 						= require( './config.js' )[ process.env.NODE_ENV ],
		favicon 					= require( 'serve-favicon' )

var environment = process.env.NODE_ENV

mongoose.connect(
	config.mongodb.connectionString,
	config.mongodb.options )

mongoose.connection.on( 'error', function ( err ) {
	console.error( 'MongoDB is not running. Please launch MongoDB before continuing.' )
	return
})

// i18n.configure({
// 	locales: 	[ 'en', 'fr' ],
// 	cookie: 	'i18n'
// })

var hdb = handlebars.create( handlebarsConfig.handlebars )
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
app.use( cookieParser( config.cookies.key ) )
app.use( session({
	cookieName: 		'session',
	secret: 				config.session.key,
	duration: 			7 * 24 * 60 * 60 * 1000, // 7 days
	activeDuration: 1 * 24 * 60 * 60 * 1000, // 1 day
	httpOnly: 			true, // don't let javascript access coockies ever
	secure: 				true, // only use coockies over https
}))
app.use( session({
	cookieName: 'eocFormData',
	secret: config.session.key,
	secure: true, // only use coockies over https
}))
app.use( flash() )
app.use( function ( req, res, next ) {
	var regex = new RegExp( 'multipart/form-data' )

	if ( regex.test( req.headers[ 'content-type' ] ) ) {
		var form = new formidable.IncomingForm()

		form.multiples = true
		form.parse( req, function ( err, fields, files ) {
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
app.use( express.static( __dirname + '/public/' ) )
app.use( favicon( __dirname + '/public/favicon.ico' ) )

app.use( function ( req, res, next ) {
	res.locals.baseURL 	= config.baseURL
	res.locals.staticResourcesPath 	= config.staticResourcesBaseURL
	// res.locals.uploadedFilePath 		= config.uploadBaseURL
	res.locals.jqueryPath 					= config.jQuery
	res.locals.jqueryPathIE8 				= config.IE8jQuery
	res.locals.jqueryUIPath 				= config.jqueryUIPath
	res.locals.csrfToken 						= req.csrfToken()
	// res.locals.flash 								= req.flash( 'flash' )[0]
	res.locals.froalaKey 						= config.froalaLicense
	res.locals.isProduction 				= process.env.NODE_ENV === 'production'
		|| process.env.NODE_ENV === 'prod'
		|| process.env.NODE_ENV === 'qsProd'
	next()
})

// routes
require( './routes.js' )( app )

app.use( function ( err, req, res, next ) {
	// log errors
	var error = null

	if ( environment === 'development' || environment === 'local' ) {
		error = err

		console.error( err )
		console.error( err.name )
		console.error( err.message )
		console.error( err.stack )
	}

	res.status( err.status || 500 )
	res.render( '500', {
		message: err.message,
		error: error
	})
})

app.use( function ( req, res, next ) {
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