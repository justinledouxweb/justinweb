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

	// heroku
	// development: {
	// 	baseURL: 								'http://eoc-ready-dev.heroku.com/',
	// 	staticResourcesBaseURL: '/',
	// 	uploadDirectory: 				'/var/www/share/eocready/uploaded-images/dev/',
	// 	uploadBaseURL: 					'//eocready.com/share/uploaded-images/dev/',
	// 	emailStaticResources: 	'http://eoc-ready-dev.heroku.com/', //'http://dev.eocready.com/public/',
	// 	leadFormFromEmail: 			'noreply@quickseries.com',
	// 	leadFormToEmail: 				'justin.ledoux@quickseries.com',
	// 	jQuery: 								'//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js',
	// 	IE8jQuery: 							'//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
	// 	froalaLicense:					'6rE-11nrujC7bmn==',
	// 	mongodb: {
	// 		options: {
	// 			server: {
	// 				socketOptions: { keepAlive: 1 }
	// 			}
	// 		},
	// 		connectionString: 'mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PASS + '@ds033153.mongolab.com:33153/heroku_z2h5xn92'
	// 	},
	// 	cookies: { key: process.env.COOKIE_KEY },
	// 	session: { key: process.env.SESSION_KEY },
	// },

	// qsDev: {
	// 	baseURL: 								'http://dev.eocready.com/',
	// 	staticResourcesBaseURL: '/',
	// 	uploadDirectory: 				'/var/www/share/eocready/uploaded-images/qsDev/',
	// 	uploadBaseURL: 					'//dev.eocready.com/share/uploaded-images/qsDev/',
	// 	emailStaticResources: 	'http://dev.eocready.com/',
	// 	leadFormToEmail: 				'justin.ledoux@quickseries.com',
	// 	leadFormFromEmail: 			'eoc-leads@quickseries.com',
	// 	jQuery: 								'//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js',
	// 	IE8jQuery: 							'//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
	// 	froalaLicense:					'2sxD-17kF-11zxdB2G-7ol==',
	// 	mongodb: {
	// 		options: {
	// 			server: {
	// 				socketOptions: { keepAlive: 1 }
	// 			}
	// 		},
	// 		connectionString: 'mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PASS + '@192.168.10.22:27017/eocready-dev'
	// 	},
	// 	cookies: { key: process.env.COOKIE_KEY },
	// 	session: { key: process.env.SESSION_KEY },
	// },

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
			connectionString: 'mongodb://localhost:27017/justinweb-local'
		},
		cookies: { key: process.env.COOKIE_KEY },
		session: { key: process.env.SESSION_KEY },
	}
}