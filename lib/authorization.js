exports.isAdmin = function ( req, res, next ) {
	if ( !req.session.user.roles || req.session.user.roles.indexOf( 'admin' ) < 0 )
		return res.redirect( '/dashboard' )

	next()
}