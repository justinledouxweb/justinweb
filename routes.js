var requireLogin 	= require( './lib/require-login.js' )

var pages 				= require( './handlers/pages.js' ),
		admin 				= require( './handlers/admin.js' ),
		login 				= require( './handlers/login.js' )

module.exports = function ( app ) {
	// MAIN PAGES
	app.get( '/', 			pages.home )

	// ADMIN ROUTES
	app.get( '/login', 	login.login )
	app.get( '/logout', login.logout )
	app.post( '/login', login.postLogin )

	app.get( '/dashboard', requireLogin.login, admin.dashboard )
}