'use strict'

const mongoose 			= require( 'mongoose' ),
			projectSchema = mongoose.Schema({
				name: 				String,
				images: 			Array,
				link: 				String,
				dateCreated: 	{ type: Date, default: Date.now }
			}),
			project = mongoose.model( 'Project', projectSchema )

module.exports = project