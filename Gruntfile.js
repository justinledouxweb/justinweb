const tasks = [
	'grunt-contrib-compass',
	'grunt-contrib-watch',
	'grunt-contrib-uglify',
	'grunt-contrib-cssmin',
	'grunt-contrib-concat',
	'grunt-contrib-copy',
	'grunt-criticalcss',
	'grunt-babel'
]

module.exports = grunt => {
	require( 'time-grunt' )( grunt )

	tasks.forEach( task => {
		grunt.loadNpmTasks( task )
	})

	grunt.initConfig({
		compass: {
			dist: {
				options: {
					sassDir: 			'public/sass',
					cssDir: 			'public/sass/build',
					imagesDir: 		'images',
					httpPath: 		require( './config.js' )[ process.env.NODE_ENV ],
					outputStyle: 	'expanded',
					force: 				true
				},
			}
		},

		criticalcss: {
			custom: {
				options: {
					url: 				'http://www.justinweb.pro',
					width: 			1200,
					height: 		900,
					outputfile: 'public/css/critical.css',
					filename: 	'public/css/main.min.css'
				}
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

		uglify: {
			target: {
				files: {
					'public/js/main.min.js': [
						'public/js/main.min.js'
					]
				}
			},
			options: {
				sourceMap: true,
				separator: ';'
			}
		},

		concat: {
			target: {
				files: {
					'public/js/main.min.js': [
						// 'public/js-dev/modules/file-upload.js',
						'public/js/main.min.js'
					]
				}
			},
			options: {
				sourceMap: true,
				separator: ';'
			}
		},

		copy: {
			jsLib: {
				expand: true,
				flaten: true,
				cwd: 'public/js-dev/',
				src: 'lib/*',
				dest: 'public/js/',
			}
		},

		babel: {
			options: {
				sourceMap: true,
				presets: ['es2015', 'react']
			},

			dist: {
				files: {
					'public/js/main.min.js': 'public/js-dev/main.js'
				}
			}
		},

		criticalcss: {
			main: {
				options: {
					url: 				config.baseURL,
					width: 			1200,
					height: 		900,
					outputfile: 'public/css/critical.css',
					filename: 	'public/css/main.min.css'
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
					'criticalcss',
					'copy:jsLib',
					'concat',
					'babel'
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
		'criticalcss',
		'copy:jsLib',
		'concat',
		'babel',
		'uglify'
	])
}