var Project = require( '../models/project.js' )

exports.projects = function ( req, res ) {
	res.render( 'projects', {
		layout: 		'admin',
		activeLink: '/projects',
		pageTitle: 	'Projects'
	})
}

exports.newProject = function ( req, res ) {
	var newProject = new Project({})

	newProject.save( function ( err, project ) {
		if ( err ) return console.log( err )

		res.render( 'new-project', {
			layout: 		'admin',
			activeLink: '/projects',
			pageTitle: 	'New Projects',
			projectId: 	project._id
		})
	})
}

exports.postProject = function ( req, res ) {
	console.log( req.files )
}

exports.patchProject = function ( req, res ) {
	console.log( req.files )
	console.log( req.body )
}