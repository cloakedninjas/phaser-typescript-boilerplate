module.exports = function (grunt) {
  grunt.initConfig({
    ts: {
      dev: {
        src: ['src/scripts/**/*.ts'],
        dest: 'public/js',
        options: {
          module: 'amd', //or commonjs
          target: 'es5', //or es3
          sourceMap: false,
          declaration: false,
          rootDir: 'src/scripts'
        }
      },
      prod: {
        src: ['src/scripts/**/*.ts'],
        reference: "src/refs.d.ts",
        out: 'public/game.min.js',
        options: {
          sourceMap: false
        }
      }
    },

    copy: {
      dev: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: [
              'assets/**'
            ],
            dest: 'public/'
          },
          {
            src: 'src/index.html',
            dest: 'public/index.html'
          },
          {
            src: 'node_modules/phaser-ce/build/custom/phaser-no-physics.js',
            dest: 'public/vendor/phaser/phaser.js'
          }
        ]
      },
      prod: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: [
              'assets/**'
            ],
            dest: 'public/'
          },
          {
            src: 'src/index-dist.html',
            dest: 'public/index.html'
          },
          {
            src: 'node_modules/phaser-ce/build/custom/phaser-no-physics.js',
            dest: 'public/vendor/phaser/phaser.js'
          }
        ]
      }
    },

    clean: {
      dev: ['public/**/*']
    },

    watch: {
      scripts: {
        files: ['src/**/*'],
        tasks: ['dev'],
        options: {
          spawn: false,
          debounceDelay: 250
        }
      }
    },

    uglify: {
      prod: {
        files: {
          'public/game.min.js': ['public/game.min.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('dev', [
    'clean:dev',
    'ts:dev',
    'copy:dev'
  ]);

  grunt.registerTask('prod', [
    'clean:dev',
    'ts:prod',
    'copy:prod',
    'uglify:prod'
  ]);
};
