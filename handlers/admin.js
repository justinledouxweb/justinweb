exports.dashboard = function ( req, res ) {
	res.render( 'dashboard', {
		layout: 'admin'
	})
}