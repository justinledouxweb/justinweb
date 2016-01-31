var bcrypt = require( 'bcryptjs' )

var User = require( '../models/user.js' )

exports.login = function ( req, res ) {
	if ( !req.session.user ) res.render( 'login' )
	else res.redirect( '/dashboard' )
}

exports.logout = function ( req, res ) {
	req.session.reset()
	delete res.locals.user
	res.redirect( '/' )
}

function invalidaEmailPassword ( req, res ) {
	req.flash( 'flash', {
		title: 		'Login error',
		message: 	'Invalid email and password. Please try again.',
		type: 		'error'
	})
}

exports.postLogin = function ( req, res ) {
	User.findOne({ email: req.body.email }, function ( err, user ) {
		if ( err ) return console.error( err )

		if ( !user ) {
			invalidaEmailPassword( req )
			return res.redirect( '/login' )
		}

		if ( bcrypt.compareSync( req.body.password, user.password ) ) {
			var user = user.toObject()

			delete user.password
			req.session.user = user
			res.locals.user = user

			return res.redirect( '/dashboard' )
		}

		invalidaEmailPassword( req )
		return res.redirect( '/login' )
	})
}