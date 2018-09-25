'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    jshint: {  // grunt-contrib-jshint
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '**/*.js',
        '!node_modules/**/*'
      ]
    },
    typescript: {
       base: {
            src: ['examples/**/*.ts'],
            options: {
                target: 'es5',
                module: 'commonjs'
            }
        }
    },
    mochaTest: {  // grunt-mocha-test
      files: ['test/**/*.js']
    },
    mochaTestConfig: {  // grunt-mocha-test
      options: {
        reporter: 'nyan'
      }
    },
    watch: {  // grunt-regarde (task renamed from regarde to watch)
      all: {
        files: [
          '**/*.js',
          '!node_modules/**/*'
        ],
        tasks: 'test'
      }
    }
  });

  grunt.registerTask('test', [
    'jshint',
    'mochaTest',
    'watch'
  ]);

  grunt.registerTask('t', 'test');

  grunt.registerTask('default', [
    'test'
  ]);

  grunt.loadNpmTasks('grunt-typescript');

  grunt.registerTask('default', ['typescript', 'test', 'jshint']);
};
