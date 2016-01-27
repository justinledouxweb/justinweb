var mongoose = require( 'mongoose' )

var projectSchema = mongoose.Schema({
	name: 				String,
	images: 			[],
	link: 				String,
	dateCreated: 	{ type: Date, default: Date.now }
})

var project = mongoose.model( 'Project', projectSchema )

module.exports = project