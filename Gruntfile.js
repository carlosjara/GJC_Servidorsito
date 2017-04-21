module.exports = function(grunt) {
	
	grunt.initConfig({
        connect: {
            server: {
                options : {
                base: 'public',
                port : 8000,
                open: {
                    target: 'http://localhost:8000'
                }
                }
            }
        },
        
        copy:{
			build:{
				files:[
					{
						src:'node_modules/bootstrap/dist/css/bootstrap.css',
						flatten: true,
						expand: true,
						dest:'public/stylesheets'
					}]
			}
		},
        watch: {
        src: {
            files: ['public/stylesheets/*.css'],
            options: {
            livereload: true
            }
        }
        }
	});
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['copy', 'watch']);
}