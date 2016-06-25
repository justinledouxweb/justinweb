var version = require( './package.json' ).version

module.exports = {
	local: {
		baseURL: 								'http://localhost:' + process.env.PORT + '/',
		staticResourcesBaseURL: '/',
		jQuery: 								'/js-dev/lib/jquery-3.0.0.min.js',
		staticResourceCache: 		{ maxage: 0, etag: false },
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
		baseURL: 								'http://justinweb.heroku.com/',
		staticResourcesBaseURL: '/',
		jQuery: 								'/js-dev/lib/jquery-3.0.0.min.js',
		staticResourceCache: 		{ maxage: 0, etag: false },
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
		baseURL: 								'http://www.justinweb.pro/',
		staticResourcesBaseURL: '/',
		jQuery: 								'/js-dev/lib/jquery-3.0.0.min.js',
		staticResourceCache: 		{ maxage: 0, etag: false },
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