exports.userManagement = function ( req, res ) {
	res.render( 'user-management', {
		layout: 		'admin',
		activeLink: '/user-management',
		pageTitle: 	'User Management'
	})
}