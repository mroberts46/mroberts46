/*
 * mroberts46
 *
 * Marc Roberts
 * https://github.com/mroberts46/mroberts46
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg   : grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    site  : grunt.file.readYAML('_config.yml'),
    bootstrap: '<%= vendor %>/bootstrap',


    // Before generating any new files, remove files from previous build.
    clean: {
      example: ['<%= site.dest %>/*.html']
    },

    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'templates/helpers/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        production: false,
        assets: '<%= site.assets %>',
        postprocess: require('pretty'),

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>'],

        // Templates
        partials: '<%= site.includes %>',
        layoutdir: '<%= site.layouts %>',
        layout: '<%= site.layout %>',

        // Extensions
        helpers: '<%= site.helpers %>',
        plugins: '<%= site.plugins %>'
      },
      example: {
        files: {'<%= site.dest %>/': ['<%= site.templates %>/*.hbs']}
      }
    },

    // Compile LESS to CSS
    less: {
      options: {
        vendor: 'vendor',
        paths: [
          '<%= site.theme %>',
          '<%= site.theme %>/bootstrap',
          '<%= site.theme %>/components',
          '<%= site.theme %>/utils'
        ]
      },
      site: {
        src: ['<%= site.theme %>/site.less'],
        dest: '<%= site.assets %>/css/site.css'
      }
    },

    // Copy Bootstrap's assets to site assets
    copy: {
      // Keep this target as a getting started point
      assets: {
        files: [
          {expand: true, cwd: '<%= bootstrap %>/dist/fonts', src: ['*.*'], dest: '<%= site.assets %>/fonts/'},
          {expand: true, cwd: '<%= bootstrap %>/dist/js',    src: ['*.*'], dest: '<%= site.assets %>/js/'},
        ]
      }
    },

    connect: {
      server: {
        options: {
          port: 4000,
          hostname: 'localhost',
          base: '<%= site.dest %>',
          open: true,
          livereload: true
        }
      }
    },

    autoprefixer: {
      files: {
        options: {
          cascade: true,
          diff: 'resources/css/diff.css'
        },
        expand: true,
        src: '<%= less.options.paths %>/*.less',
        dest: '<%= site.assets %>/css/site.less'
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 6,
          svgoPlugins: [{
            removeViewBox: false
          }]
        },
        files: [{
          expand: true,
          cwd: 'resources/',
          src: '**/*.{png,jpg,gif}',
          dest: '<%= site.assets %>/img/'
        }]
      }
    },

    svgstore: {
      options: {
        prefix: 'ico-',
        includedemo: true
      },
      files: {
        expand: true,
        cwd: 'resources/svg/',
        src: '*.svg',
        dest: '<%= site.assets %>/svg/finished.svg'
      }
    },

    watch: {
      all: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint', 'nodeunit']
      },
      site: {
        options: {
          livereload: true,
          reload: true
        },
        files: ['Gruntfile.js', '<%= less.options.paths %>/*.less', 'templates/**/*.hbs'],
        tasks: ['design']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-sync-pkg');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('assemble');

  // Build HTML, compile LESS and watch for changes. You must first run "bower install"
  // or install Bootstrap to the "vendor" directory before running this command.
  grunt.registerTask('design', ['clean', 'assemble', 'less:site', 'watch:site']);
  grunt.registerTask('docs', ['readme', 'sync']);

  // Use this going forward.
  grunt.registerTask('default', ['clean','jshint','copy','svgstore','assemble','imagemin','autoprefixer','less','docs','connect','watch:site']);
};