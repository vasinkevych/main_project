module.exports = function(config) {

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // frameworks to use
        // some available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],

        // list of files / patterns to load in the browser
        files: ["bower_components/angular/angular.js",
            "bower_components/angular-ui-router/release/angular-ui-router.js",
            "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
            "bower_components/angular-messages/angular-messages.js",
            "bower_components/angular-sanitize/angular-sanitize.js",
            "node_modules/angular-mocks/angular-mocks.js",
             "src/**/*.spec.js",
             "src/app/admin/faculties/faculties.controller.spec.js",
             "src/app/**/*.module.js",
             ".tmp/js/config.js",
             ".tmp/js/templates.js",
             "src/app/**/*.js",
            ".tmp/js/app.js"

        ],

        // list of files to exclude
        exclude: [
        ],

        plugins: ["karma-jasmine", "karma-chrome-launcher", "karma-htmlfile-reporter"],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},

        // test results reporter to use
        // possible values: 'dots', 'progress', 'coverage'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "html"],

        htmlReporter: {
            outputFile: "tests/units.html"
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //        browsers: ['Chrome', 'ChromeCanary', 'FirefoxAurora', 'Safari', 'PhantomJS'],
        browsers: ["Chrome"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};