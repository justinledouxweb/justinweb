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
		s3: {
			accessKeyId: 'Your access key',
			secretAccessKey: 'Your secret access key',
			region: 'us-west-2'
		}
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
		}
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
		}
	}
}