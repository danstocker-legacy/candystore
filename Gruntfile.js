/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var config = {
        pkg: grunt.file.readJSON('package.json'),

        params: {
            jsFiles: [
                'src/namespace.js',
                'src/utils/StringUtils.js',
                'src/utils/Debouncer.js',
                'src/behaviors/Disableable.js',
                'src/behaviors/Highlightable.js',
                'src/behaviors/EntityWidget.js',
                'src/behaviors/Popup.js',
                'src/behaviors/AlignedPopup.js',
                'src/behaviors/Option.js',
                'src/behaviors/OptionList.js',
                'src/behaviors/FieldBound.js',
                'src/widgets/utils/ResizeWatcher.js',
                'src/widgets/utils/HotKeyWatcher.js',
                'src/widgets/Label.js',
                'src/widgets/HtmlLabel.js',
                'src/widgets/DataLabel.js',
                'src/widgets/Link.js',
                'src/widgets/DataLink.js',
                'src/widgets/Image.js',
                'src/widgets/DataImage.js',
                'src/widgets/DynamicImage.js',
                'src/widgets/DataDynamicImage.js',
                'src/widgets/Button.js',
                'src/widgets/TextButton.js',
                'src/widgets/Dropdown.js',
                'src/widgets/DataDropdown.js',
                'src/widgets/DropdownButton.js',
                'src/widgets/DataDropdownButton.js',
                'src/widgets/List.js',
                'src/widgets/DataList.js',
                'src/widgets/Flow.js',
                'src/widgets/Page.js',
                'src/widgets/form/Input.js',
                'src/widgets/form/TextInput.js',
                'src/widgets/form/DataTextInput.js',
                'src/widgets/form/PasswordInput.js',
                'src/widgets/form/FormField.js',
                'src/widgets/form/Form.js',
                'src/exports.js'
            ],

            cssFiles: [
                'src/behaviors/Popup.css',
                'src/behaviors/Option.css',
                'src/widgets/Button.css',
                'src/widgets/TextButton.css',
                'src/widgets/List.css',
                'src/widgets/Dropdown.css',
                'src/widgets/DropdownButton.css',
                'src/widgets/DynamicImage.css',
                'src/widgets/form/Input.css',
                'src/widgets/form/Form.css'
            ],

            test: [
            ],

            globals: {
                dessert: true,
                troop  : true,
                sntls  : true,
                evan   : true
            }
        },

        outPath              : 'out',
        jsFileNameVersion    : '<%= pkg.name %>-<%= pkg.version %>.js',
        jsFilePath           : '<%= pkg.name %>.js',
        jsFilePathVersion    : '<%= outPath %>/<%= pkg.name %>-<%= pkg.version %>.js',
        jsFilePathVersionMin : '<%= outPath %>/<%= pkg.name %>-<%= pkg.version %>-min.js',
        cssFileNameVersion   : '<%= pkg.name %>-<%= pkg.version %>.css',
        cssFilePath          : '<%= pkg.name %>.css',
        cssFilePathVersion   : '<%= outPath %>/<%= pkg.name %>-<%= pkg.version %>.css',
        cssFilePathVersionMin: '<%= outPath %>/<%= pkg.name %>-<%= pkg.version %>-min.css',

        /**
         * Concatenates project files into a final output file, according to
         * file list specified in params.
         */
        concat: {
            options: {
                separator: '',
                banner   : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                           '<%= grunt.template.today("yyyy-mm-dd") %> - ' +
                           '<%= pkg.author %> - <%= pkg.copyright %>*/\n'
            },

            js: {
                src : '<%= params.jsFiles %>',
                dest: '<%= jsFilePath %>'
            },

            css: {
                src : '<%= params.cssFiles %>',
                dest: '<%= cssFilePath %>'
            }
        },

        /**
         * Minifies output file.
         */
        min: {
            dist: {
                src : ['<%= jsFilePath %>'],
                dest: '<%= jsFilePathVersionMin %>'
            }
        },

        /**
         * Minifies output file.
         */
        cssmin: {
            dist: {
                src : ['<%= cssFilePath %>'],
                dest: '<%= cssFilePathVersionMin %>'
            }
        },

        /**
         * Copies output file to output folder by name w/ version number included.
         */
        copy: {
            js: {
                files: [
                    {src: '<%= jsFilePath %>', dest: '<%= jsFilePathVersion %>'}
                ]
            },

            css: {
                files: [
                    {src: '<%= cssFilePath %>', dest: '<%= cssFilePathVersion %>'}
                ]
            }
        },

        /**
         * Runs jsHint code quality assessment.
         */
        jshint: {
            options: {
                globals: '<%= params.globals %>',
                ignores: ['src/**/*.test.js']
            },

            all: ['Gruntfile.js', 'src/**/*.js']
        },

        /**
         * Runs unit tests.
         * JSTestDriver service must be started.
         * See https://github.com/rickyclegg/grunt-jstestdriver#starting-the-server
         */
        jstestdriver: {
            files: '<%= params.test %>'
        },

        /**
         * Generates documentation
         */
        jsdoc: {
            dist: {
                src    : ['<%= params.jsFiles %>', 'README.md'],
                options: {
                    destination: 'doc'
                }
            }
        },

        /**
         * Strips out assumed class instantiation (new Xxxx) from generated documentation.
         */
        "regex-replace": {
            strip: {
                src    : ['doc/<%= pkg.name%>.*.html'],
                actions: [
                    {
                        name   : 'stripNew',
                        search : '(<div class="container-overview">)\\s*<dt>[\\w<>="-/\\s]*?</dt>',
                        replace: '$1'
                    }
                ]
            }
        }
    };

    grunt.initConfig(config);

    // test-related tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jstestdriver');
    grunt.registerTask('test', ['jshint', 'jstestdriver']);

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.registerTask('doc', ['jsdoc', 'regex-replace:strip']);

    // build-related tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-yui-compressor');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //    grunt.registerTask('build', ['test', 'concat:js', 'concat:css', 'copy:js', 'copy:css', 'min:js', 'min:css']);
    grunt.registerTask('build', ['concat:js', 'concat:css', 'copy:js', 'copy:css', 'min', 'cssmin']);

    grunt.registerTask('default', ['test']);
};
