const config = require( './config.js' )[ process.env.NODE_ENV ]

const tasks = [
	'grunt-contrib-compass',
	'grunt-contrib-watch',
	'grunt-contrib-uglify',
	'grunt-contrib-cssmin',
	'grunt-contrib-concat',
	'grunt-babel'
]

const jsSettings = {
	target: {
		files: {
			'public/js/main.min.js': [
				'public/js-dev/modules/file-upload.js',
				'public/js-dev/main.js'
			]
		}
	},
	options: {
		sourceMap: true,
		separator: ';'
	}
}

module.exports = function ( grunt ) {
	tasks.forEach( function ( task ) {
		grunt.loadNpmTasks( task )
	})

	grunt.initConfig({
		compass: {
			dist: {
				options: {
					sassDir: 			'public/sass',
					cssDir: 			'public/sass/build',
					imagesDir: 		'images',
					httpPath: 		config.staticResourcesBaseURL,
					outputStyle: 	'expanded',
					force: 				true
				},
			}
		},

		cssmin: {
			target: {
				files: {
					'public/css/main.min.css': ['public/sass/build/main.css'],
				}
			},
			options: {
				sourceMap: true
			}
		},

		uglify: jsSettings,

		concat: jsSettings,

		babel: {
			options: {
				sourceMap: true,
				presets: ['es2015']
			},

			dist: {
				files: {
					'public/js/main.js': 'public/js-dev/main.js'
				}
			}
		},

		watch: {
			staticFiles: {
				files: [
					'public/sass/**/*',
					'!public/sass/build',
					'!public/sass/build/**/*',
					'public/js-dev/**/*',
					'public/images/**/*',
				],
				tasks: [
					'compass',
					'cssmin',
					'babel',
					// 'concat',
					// 'copy:jsLib'
				]
			}
		}
	})

	grunt.registerTask( 'static', [
		'watch:staticFiles'
	])

	grunt.registerTask( 'all', [
		'compass',
		'cssmin',
		'uglify'
	])
}