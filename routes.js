'use strict'

let fs 							= require( 'fs' )

let requireLogin 		= require( './lib/require-login.js' ),
		auth 						= require( './lib/authorization.js' )

let pages 					= require( './handlers/pages.js' ),
		admin 					= require( './handlers/admin.js' ),
		login 					= require( './handlers/login.js' ),
		projects 				= require( './handlers/projects.js' ),
		userManagement 	= require( './handlers/user-management.js' ),
		temp 						= require( './handlers/temp-projects.js' )

module.exports = app => {
	// MAIN PAGES
	app.get( '/', 						pages.home )
	app.get( '/download/cv', 	pages.downloadCV )

	// ADMIN ROUTES
	// app.get( '/login', 	login.login )
	// app.get( '/logout', login.logout )
	// app.post( '/login', login.postLogin )

	// app.get( '/dashboard', requireLogin.login, admin.dashboard )

	// app.get( '/projects', requireLogin.login, auth.isAdmin, projects.projects )
	// app.get( '/projects/new', requireLogin.login, auth.isAdmin, projects.newProject )
	// app.post( '/projects/new', requireLogin.login, auth.isAdmin, projects.postProject )
	// app.patch( '/projects/new', requireLogin.login, auth.isAdmin, projects.patchProject )

	// app.get( '/user-management', 	requireLogin.login, auth.isAdmin, userManagement.userManagement )

	// app.get( '/projects', requireLogin.login, temp.projects )
	// app.get( '/projects/compass-offline', requireLogin.login, temp.compass )
	// app.get( '/projects/data/charts.json', requireLogin.login, temp.compassData )
	// app.get( '/projects/:page', requireLogin.login, temp.compassPages )
}