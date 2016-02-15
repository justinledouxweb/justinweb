'use strict'

exports.userManagement = ( req, res ) => {
	res.render( 'user-management', {
		layout: 		'admin',
		activeLink: '/user-management',
		pageTitle: 	'User Management'
	})
}