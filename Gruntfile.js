/*
 * Knihovna pro efektivní nahrávání obrázků na webový server 
 * 
 * Licensed under MIT License
 */
module.exports = function (grunt) {
  'use strict';
  // Project configuration
  grunt.initConfig({
    latex: {
      pdf: {
        src: 'main.tex',
        options: {
          outputDirectory: 'dist/',
          jobname: 'thesis'
        }
      },
      bib: {
        src: 'dist/thesis.aux',
        options: {
          engine: 'bibtex',
          interaction: false
        }
      }
    },
    connect: {
      server: {
        options: {
					port: 3030,
          hostname: 'localhost',
          base: 'dist',
          open: 'http://localhost:3030/thesis.pdf'
        }
      }
    },
    watch: {
      latex: {
        files: '**/*.tex',
        tasks: [ 'typo', 'latex', 'latex:pdf']
      },
      bibtex: {
        files: '**/*.bib',
        tasks: ['latex:bib', 'latex:pdf']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: ['dist/thesis.pdf'],
      },
    }
  });

  // These plugins provide necessary tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-latex');
	
	// Default task
		grunt.registerTask('typo', 'Pred predložky pridá nedelitelľné medzery', function(a, b, c) {
    grunt.log.writeln('Currently running the "typo" task.');

    var fs = require('fs');

    var fn = function( src )
    {
      var srcDir = fs.readdirSync( src );
      
      for ( var i = 0; i < srcDir.length; i++ )
      {
        var dir = srcDir[i];
        var path = src + '/' + dir;
        var stats = fs.statSync( path );

        if ( stats.isDirectory() )
        {
          fn( path );
        }

        else
        {
          if ( dir.match(/\.tex$/) )
          {
            var file = fs.readFileSync( path, { encoding: 'utf-8'} );
            file = file.replace( / (a|bez|cez|do|k|medzi|na|o|od|okrem|po|pod|pre|pred|pri|proti|s|so|u|z|zo|za|v|ku|nad) /gi, function( match, p1 ) { console.log(match, p1); return ' ' + p1 + '~'; } );
            fs.writeFileSync( path, file );
          }
        }
      }
    }

    fn('src');

  });

  // Default task
  grunt.registerTask('default', ['connect', 'watch']);
};
