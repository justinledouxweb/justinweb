var Project = require( '../models/project.js' )

var async 			= require( 'async' ),
		aws 				= require( 'aws-sdk' )

aws.config.update( config.s3 );

var s3 					= new aws.S3(),
		bucketName 	= 'justinweb'

exports.projects = function ( req, res ) {
	res.render( 'projects', {
		layout: 		'admin',
		activeLink: '/projects',
		pageTitle: 	'Projects'
	})
}

exports.newProject = function ( req, res ) {
	res.render( 'new-project', {
		layout: 		'admin',
		activeLink: '/projects',
		pageTitle: 	'New Projects'
	})
}

exports.postProject = function ( req, res ) {
	var newProject = new Project( req.body ),
			imagePaths = []

	if ( req.files ) {
		async.each(
			req.files[ 'images[]' ],
			function ( file, cb ) {
				cloudinary.uploader.upload( file.path, function ( err, result ) {
					if ( err ) return cb( err )
					imagePaths.push( result )
					cb()
				})
			}, function ( err ) {
				// if ( err ) return console.error( err )

				console.log( imagePaths )
				// console.log( 'testttejgeheirgiuehgiuhegiuerigeliurgeiuhrgieuhg' )

				return
				newProject.save( function ( err, doc ) {
					if ( err ) return console.error( err )

					return

					return res.json({
						success: true,
						data: {
							id: doc._id
						}
					})
				})
			})
	}

	else {
		newProject.save( ( err, doc ) => {
			if ( err ) return console.error( err )

			return res.json({
				success: true,
				data: {
					id: doc._id
				}
			})
		})
	}
}

exports.patchProject = function ( req, res ) {
	var id = req.body.id

	delete req.body._csrf
	delete req.body.id

	if ( req.files )
		console.log( req.files )

	return
	// saveImages( req.body.images )

	Project.findOneAndUpdate(
		{ _id: id },
		{ $set: req.body },
		( err, project ) => {
			if ( err ) return console.error( err )
			
			res.json({
				success: true
			})
		})
}