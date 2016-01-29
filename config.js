var version = require( './package.json' ).version

module.exports = {
	local: {
		baseURL: 								'http://localhost:' + process.env.PORT + '/',
		staticResourcesBaseURL: '/',
		jQuery: 								'/js-dev/lib/jquery-2.2.0.min.js',
		IE8jQuery: 							'/js-dev/lib/jquery-1.11.3.js',
		mongodb: {
			options: {
				server: {
					socketOptions: { keepAlive: 1 }
				}
			},
			connectionString: 'mongodb://localhost:27017/justinweb-local'
		},
		cookies: { key: process.env.COOKIE_KEY },
		session: { key: process.env.SESSION_KEY },
	},

	staging: {
		baseURL: 								'http://justweb.heroku.com',
		staticResourcesBaseURL: '/',
		jQuery: 								'/js-dev/lib/jquery-2.2.0.min.js',
		IE8jQuery: 							'/js-dev/lib/jquery-1.11.3.js',
		mongodb: {
			options: {
				server: {
					socketOptions: { keepAlive: 1 }
				}
			},
			connectionString: process.env.MONGOLAB_URI
		},
		cookies: { key: process.env.COOKIE_KEY },
		session: { key: process.env.SESSION_KEY },
	},

	production: {
		baseURL: 								'http://justweb.heroku.com',
		staticResourcesBaseURL: '/',
		jQuery: 								'/js-dev/lib/jquery-2.2.0.min.js',
		IE8jQuery: 							'/js-dev/lib/jquery-1.11.3.js',
		mongodb: {
			options: {
				server: {
					socketOptions: { keepAlive: 1 }
				}
			},
			connectionString: process.env.MONGOLAB_URI
		},
		cookies: { key: process.env.COOKIE_KEY },
		session: { key: process.env.SESSION_KEY },
	}
}