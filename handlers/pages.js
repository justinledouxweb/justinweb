// TODO: Move to DB when back-end portal is created
var experiences 	= require( '../data/experiences.json' ).experiences,
		technologies 	= require( '../data/technologies.json' ).technologies,
		competencies 	= require( '../data/competencies.json' ).competencies

exports.home = function ( req, res ) {
	res.render( 'home', {
		experiences: experiences,

		// TODO: not clean, perhaps move the lineNumber logic to a
		// custom handlebars helper...
		technologies: {
			technologies: technologies,
			lineNumber: technologies.length + 2,
		},

		// TODO: not clean, perhaps move the lineNumber logic to a
		// custom handlebars helper...
		competencies: {
			competencies: competencies,
			lineNumber: competencies.length + 2
		}
	})
}