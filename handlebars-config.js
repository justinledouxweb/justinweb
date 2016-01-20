var i18n 			= require( 'i18n' ),
		moment 		= require( 'moment' ),
		toolbelt 	= require( './lib/toolbelt.js' )

var operators = {
	'===': 	function ( l, r ) { return l === r },
	'==': 	function ( l, r ) { return l == r },
	'!==': 	function ( l, r ) { return l !== r },
	'!=': 	function ( l, r ) { return l != r },
	'<=': 	function ( l, r ) { return l <= r },
	'>=': 	function ( l, r ) { return l >= r },
	'<': 		function ( l, r ) { return l < r },
	'>': 		function ( l, r ) { return l > r }
}

module.exports = {
	handlebars: {
		defaultLayout: 'main',
		helpers: {
			increment: function ( index, offsetValue ) {
				if ( isNaN( index ) || isNaN( offsetValue ) ) throw Error( 'Handlebars Helper "increment" requires 2 parameters' )

				return index + offsetValue
			},

			for: function ( n, block ) {
				var result = ''

				for ( var i = 0, l = n; i < l; i++ ) {
					result += block.fn( i )
				}

				return result
			},

			section: function ( name, options ) {
				if ( !this._sections ) this._sections = {}
				this._sections[name] = options.fn( this )
				return null
			},

			static: function ( name ) {
				return require( './lib/static.js' ).map( name )
			},

			hasValue: function ( variable ) {
				return variable ? 'value=' + variable : ''
			},

			compare: function ( lValue, rValue, operator, output ) {
				if ( arguments.length < 3 ) throw Error( 'Handlebars Helper "compare" needs 2 parameters' )
				if ( !operators[operator] ) throw Error( 'Handlebars Helper "compare" doesn\'t know the operator ' + operator )

				var result = operators[operator]( lValue, rValue )

				if ( result ) return output
				else return ''
			},

			layoutType: function ( className ) {
				if ( !this._layoutType ) this._layoutType = {}
				this._layoutType[ 'className' ] = className
				return null
			},

			ifElse: function ( lValue, rValue, operator, trueOutcome, falseOutcome ) {
				if ( arguments.length < 6 ) throw Error( 'Handlebars Helper "ifElse" needs 5 parameters' )
				if ( !operators[operator] ) throw Error( 'Handlebars Helper "ifElse" doesn\'t know the operator ' + operator )

				var result = operators[operator]( lValue, rValue )

				if ( result ) return trueOutcome
				else return falseOutcome
			},

			ifAll: function () {
				console.log( arguments )

				var isTrue = true

				for ( argument in arguments ) {
					if ( argument ) isTrue &= true
				}

				return isTrue ? arguments[ arguments.length - 1 ].fn() : arguments[ arguments.length - 1 ].inverse()
			},

			modulo: function ( val, divisor, options ) {
				var fnTrue 	= options.fn,
						fnFalse = options.inverse

				return val % divisor === 0 ? fnTrue() : fnFalse()
			},

			newline: function () {
				return '\n\n'
			},

			formatTextarea: function ( array ) {
				var cleanArray 	= [],
						l 					= array.length - 1

				array.forEach( function ( a, index ) {
					if ( a !== '' && index !== l ) cleanArray.push( a + '\n\n' )
					else cleanArray.push( a )
				})

				return cleanArray.join( '' )
			},

			replace: function ( value, target, result ) {
				return value.replace( target, result )
			},

			__: function () {
				return i18n.__.apply( this, arguments )
			},

			__n: function () {
				return i18n.__n.apply( this, arguments )
			},

			formatPhoneNumber: function ( value ) {
				if ( !value || value === undefined ) return ''

				return toolbelt.formatPhoneNumber( value )
			},

			ifIndexOf: function ( array, value, returnedValue ) {
				if ( array
					&& value
					&& array.indexOf( value ) >= 0 )
					return returnedValue

				return false
			},

			formatDate: function ( date, format ) {
				return moment( date ).format( format )
			},

			ifIndexOf: function ( array, value ) {
				return array
					&& array.indexOf( value ) >= 0
			},

			toString: function ( value ) {
				return value && value.toString()
			}
		},
	}
}