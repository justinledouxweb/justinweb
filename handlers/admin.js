'use strict'

exports.dashboard = ( req, res ) => {
	res.render( 'dashboard', {
		layout: 		'admin',
		activeLink: '/dashboard',
		pageTitle: 	'Dashboard'
	})
}

