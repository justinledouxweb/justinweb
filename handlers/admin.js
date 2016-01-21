exports.dashboard = function ( req, res ) {
	res.render( 'dashboard', {
		layout: 		'admin',
		activeLink: '/dashboard',
		pageTitle: 	'Dashboard'
	})
}

exports.projects = function ( req, res ) {
	res.render( 'projects', {
		layout: 		'admin',
		activeLink: '/projects',
		pageTitle: 	'Projects'
	})
}

exports.userManagement = function ( req, res ) {
	res.render( 'user-management', {
		layout: 		'admin',
		activeLink: '/user-management',
		pageTitle: 	'User Management'
	})
}