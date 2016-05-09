'use strict'

let async 	= require( 'async' ),
		mkdirp 	= require( 'mkdirp' ),
		fs 			= require( 'fs.extra' ),
		gm 			= require( 'gm' )

exports.formatPhoneNumber = function ( value ) {
	if ( value === undefined || value === null ) return ''
	if ( typeof value === 'string' ) return value 
	if ( typeof value === 'number' ) {
		let value = value.toString()

		if ( value.length === 10 || value.length === 11 ) {
			value = value.length === 11
				? value.replace( /(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4' )
				: value.replace( /(\d{3})(\d{3})(\d{4})/, '($1) $2-$3' )
		}

		return value
	}
}

// This takes text from a textbox and converts the carriage returns
// to <br> tags.
exports.parseParagraphToHTML = function ( value ) {
	return value.replace( /\r|\n/g, '<br/>' )
}

exports.moveFiles = function ( options ) {
	options.files.forEach( function ( file ) {
		fs.rename( file.oldPath, file.newPath, options.callback )
	})
}

/*
 * Check is the request payload contains files by checking for the size
 * key of the req.files object
 */
exports.payloadContainsFiles = function ( files ) {
	let containsFiles = false

	if ( Object.getOwnPropertyNames( files ).length > 0 ) {
		for ( file in files ) {
			if ( files[ file ].size > 0 ) {
				containsFiles = true
				break
			}
		}
	}

	return containsFiles
}

/*
 * This method resized an image
 */
exports.resizeImage = function ( options, callback ) {
	let proportional = options.proportional ? null : '!'

	mkdirp( options.writePath, function ( err ) {
		if ( err ) return options.callback( err );

		gm( options.path )
			.resize( options.width, options.height, proportional )
			.write( options.writePath + options.fileName, callback || options.callback )
	})
}

/*
 * This method will only compare values of the first level
 * of keys. It is not a recursive or deep compare
 */
exports.compareObjects = function ( obj1, obj2 ) {
	let hasChanged = false

	for ( key in obj1 ) {
		if ( obj1[ key ] !== obj2[ key ] ) {
			hasChanged = true
			break;
		}
	}

	return hasChanged;
}

/*
 * The files array must contain the following object structure
 * {
 * 		oldPath: String,
 * 		newPath: String,
 * 		name: String
 * }
 */
exports.uploadFiles = function ( files, callback ) {
	async.each(
		files,
		( file, callback ) => {
			mkdirp( file.newPath, ( err ) => {
				if ( err ) return callback( err );

				fs.move( file.oldPath, `${file.newPath}/${file.name}`, callback )
			})
		},
		( err ) => {
			callback && callback( err )
		})
}

/*
 * The files array must contain the following object structure
 * {
 * 		oldName: String,
 * 		newName: String,
 * }
 */
exports.renameFiles = function ( files, callback ) {
	async.each(
		files,
		( file, callback ) => {
			fs.rename( file.oldName, file.newName, callback )
		},
		( err ) => {
			callback && callback( err )
		})
}

/*
 * The files array must contain string of the path of the file you wish to
 * delete
 */
exports.deleteFiles = function ( files, callback ) {
	async.each(
		files,
		( file, callback ) => {
			fs.unlink( file, callback )
		},
		( err ) => {
			callback && callback( err )
		})
}

exports.jsonToUrlEncoded = function ( json, startWithQuestionMark ) {
	let string  = startWithQuestionMark ? '?' : '&',
			index   = 0

	for ( key in json ) {
		if ( json[ key ] ) {
			if ( index > 0 ) string += '&'
		
			string += encodeURIComponent( key )
			string += '='
			string += encodeURIComponent( json[ key ] )

			index++
		}
	}

	return string
}

exports.deepCompare = function ( /* any number of arguments */ ) {
	let i, l, leftChain, rightChain

	function compare2Objects ( x, y ) {
		let p

		// remember that NaN === NaN returns false
		// and isNaN(undefined) returns true
		if ( isNaN( x )
			&& isNaN( y )
			&& typeof x === 'number'
			&& typeof y === 'number' )
			return true

		// Compare primitives and functions.     
		// Check if both arguments link to the same object.
		// Especially useful on step when comparing prototypes
		if ( x === y )
			return true

		// Works in case when functions are created in constructor.
		// Comparing dates is a common scenario. Another built-ins?
		// We can even handle functions passed across iframes
		if ( ( typeof x === 'function' && typeof y === 'function' )
			|| ( x instanceof Date && y instanceof Date )
			|| ( x instanceof RegExp && y instanceof RegExp )
			|| ( x instanceof String && y instanceof String )
			|| ( x instanceof Number && y instanceof Number ) ) {
				return x.toString() === y.toString()
		}

		// At last checking prototypes as good a we can
		if ( !( x instanceof Object && y instanceof Object ) )
			return false

		if ( x.isPrototypeOf( y ) || y.isPrototypeOf( x ) )
			return false

		if ( x.constructor !== y.constructor )
			return false

		if ( x.prototype !== y.prototype )
			return false

		// Check for infinitive linking loops
		if ( leftChain.indexOf( x ) > -1 || rightChain.indexOf( y ) > -1 )
			return false

		// Quick checking of one object beeing a subset of another.
		// todo: cache the structure of arguments[0] for performance
		for ( p in y ) {
			if ( y.hasOwnProperty( p ) !== x.hasOwnProperty( p ) )
				return false

			else if ( typeof y[p] !== typeof x[p] )
				return false
		}

		for ( p in x ) {
			if ( y.hasOwnProperty( p ) !== x.hasOwnProperty( p ) )
				return false

			else if ( typeof y[p] !== typeof x[p] )
				return false

			switch ( typeof ( x[p] ) ) {
				case 'object':
				case 'function':
					leftChain.push( x )
					rightChain.push( y )

					if ( !compare2Objects( x[p], y[p] ) )
						return false

					leftChain.pop()
					rightChain.pop()

					break

				default:
					if ( x[p] !== y[p] )
						return false

					break
			}
		}

		return true
	}

	if ( arguments.length < 1 )
		return true
		// Die silently? Don't know how to handle such case, please help...
		// throw "Need two or more arguments to compare";

	for (i = 1, l = arguments.length; i < l; i++) {
		leftChain 	= [] //Todo: this can be cached
		rightChain 	= []

		if ( !compare2Objects( arguments[0], arguments[i] ) )
			return false
	}

	return true
}

exports.randomString = function ( length, chars ) {
	let mask 		= '',
			result 	= ''

	if ( chars.indexOf( 'a' ) > -1 ) mask += 'abcdefghijklmnopqrstuvwxyz'
	if ( chars.indexOf( 'A' ) > -1 ) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	if ( chars.indexOf( '#' ) > -1 ) mask += '0123456789'
	if ( chars.indexOf( '!' ) > -1 ) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'

	for ( var i = length; i > 0; --i )
		result += mask[ Math.round( Math.random() * ( mask.length - 1 ) ) ]

	return result
}