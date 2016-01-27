var mongoose = require( 'mongoose' )

var userSchema = mongoose.Schema({
	fullName: 		String,
	email: 				{ type: String, unique: true },
	password: 		String,
	roles: 				Array,
	dateCreated: 	{ type: Date, default: Date.now }
})

var user = mongoose.model( 'User', userSchema )

module.exports = user