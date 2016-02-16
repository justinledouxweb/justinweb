'use strict'

// TODO: Move to DB when back-end portal is created
const experiences 	= require( '../data/experiences.json' ).experiences,
			technologies 	= require( '../data/technologies.json' ).technologies,
			competencies 	= require( '../data/competencies.json' ).competencies

exports.home = ( req, res ) => {
	res.render( 'home', {
		localData: JSON.stringify({
			experiences: experiences,
			technologies: technologies,
			competencies: competencies
		}),

		experiences: experiences,
		technologies: technologies,
		competencies: competencies,
	})
}