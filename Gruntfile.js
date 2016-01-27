var config = require( './config.js' )[ process.env.NODE_ENV ]

var tasks = [
	'grunt-contrib-compass',
	'grunt-contrib-watch',
	'grunt-contrib-uglify',
	'grunt-contrib-cssmin',
	'grunt-contrib-concat',
	'grunt-contrib-copy',
]

var jsSettings = {
	target: {
		files: {
			'public/js/main.min.js': [
				'public/js-dev/modules/file-upload.js',
				// 'public/js-dev/modules/stickify.js',
				// 'public/js-dev/lib/echo.js',
				// 'public/js-dev/lib/handlebars-v4.0.2.js',
				'public/js-dev/main.js',
			],

			// 'public/js/ie8.min.js': [
			// 	'public/js-dev/lib/html5-shiv.js',
			// 	'public/js-dev/lib/respond.js',
			// 	'public/js-dev/lib/selectivizr.js',
			// ],

			// 'public/js/admin.min.js': [
			// 	'public/js-dev/modules/stickify.js',
			// 	'public/js-dev/build/admin.js',
			// ],

			// 'public/js/lib.min.js': [
			// 	'public/js-dev/lib/jquery-ui-1.11.4.js',
			// 	'public/js-dev/lib/froala-editor.js',
			// 	'public/js-dev/lib/froala/plugins/froala-lists.js',
			// 	'public/js-dev/lib/froala/plugins/froala-link.js',
			// 	'public/js-dev/lib/froala/plugins/froala-align.js',
			// 	'public/js-dev/lib/froala/plugins/froala-html.js',
			// 	'public/js-dev/lib/froala/languages/froala-align.js',
			// 	'public/js-dev/lib/react-js/react.js'
			// ],

			// 'public/js/login.min.js': [
			// 	'public/js-dev/lib/handlebars-v4.0.2.js',
			// 	'public/js-dev/login.js',
			// ]
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

		copy: {
			font: {
				expand: true,
				flaten: true,
				cwd: 'public/sass/',
				src: 'fonts/*',
				dest: 'public/css/',
			},

			jsLib: {
				expand: true,
				flaten: true,
				cwd: 'public/js-dev/',
				src: 'lib/*',
				dest: 'public/js/',
			}
		},

		browserify: {
			dist: {
				options: {
					transform: [
						['babelify']
					]
				},
				files: {
					'public/js-dev/build/admin.js': ['public/js-dev/admin.js']
				}
			}
		},

		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: 'blanket'
				},
				src: [ 'test/**/*.js' ]
			},
			coverage: {
				options: {
					reporter: 'html-cov',
					quiet: true,
					captureFile: 'coverage.html'
				},
				src: [ 'test/**/*.js' ]
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
					'concat',
					'copy:jsLib'
				]
			}
		},
	})

	grunt.registerTask( 'static', [
		'watch:staticFiles'
	])

	grunt.registerTask( 'all', [
		'compass',
		'cssmin',
		'uglify',
		'copy'
	])
}