var path = require( 'path' ),
		chartsData = require( '../data/charts.json' )

exports.projects = function ( req, res ) {
	res.render( 'temp-projects' )
}

exports.compass = function ( req, res ) {
	res.sendFile( 'index.html', { root: path.join(__dirname, '../views/compass' ) })
}

exports.compassPages = function ( req, res ) {
	var page = req.params.page

	res.sendFile( page, { root: path.join(__dirname, '../views/compass' ) })
}