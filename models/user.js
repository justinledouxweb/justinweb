'use strict'

const mongoose 		= require( 'mongoose' ),
			userSchema 	= mongoose.Schema({
				fullName: 		String,
				email: 				{ type: String, unique: true },
				password: 		String,
				roles: 				Array,
				dateCreated: 	{ type: Date, default: Date.now }
			}),
			user = mongoose.model( 'User', userSchema )

module.exports = user