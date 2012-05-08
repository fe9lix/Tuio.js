module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: "<json:package.json>",
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    qunit: {
      files: ["test/**/*.html"]
    },
    concat: {
      dist: {
        src: [
          "<banner:meta.banner>",
          "libs/lodash.js",
          "libs/socket.io.js",
          "src/Tuio.js",
          "src/TuioTime.js",
          "src/TuioPoint.js",
          "src/TuioContainer.js",
          "src/TuioCursor.js",
          "src/TuioObject.js",
          "src/TuioClient.js"
        ],
        dest: "dist/<%= pkg.name %>"
      }
    },
    min: {
      dist: {
        src: [
          "<banner:meta.banner>",
          "<config:concat.dist.dest>"
        ],
        dest: 'dist/<%= pkg.name.split(".")[0] %>.min.js'
      }
    },
    lint: {
      src: "src/**/*.js",
      grunt: "grunt.js",
      tests: "test/**/*.js"
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        regexp: true,
        undef: true,
        trailing: true,
        boss: true,
        browser: true,
        jquery: true,
        node: true
      },
      globals: {},
      grunt: {
        options: this.options,
        globals: {
          task: true,
          config: true,
          file: true,
          log: true,
          template: true}
      },
      src: {
        options: this.options,
        globals: {
          _: true,
          Tuio: true,
          io: true}
      },
      tests: {
        options: this.options,
        globals: {
          module: true,
          test: true,
          ok: true,
          equal: true,
          deepEqual: true,
          QUnit: true,
          Tuio: true,
          io: true}
      }
    },
    watch: {
      files: [
        "<config:lint.src>",
        "<config:lint.grunt>",
        "<config:lint.tests>"
      ],
      tasks: "lint concat min"
    }
  });

  // Default task.
  grunt.registerTask("default", "lint qunit concat min");

};