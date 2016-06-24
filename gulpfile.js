var gulp = require("gulp");
var config = require("./gulp.config")();
var bowerFiles = require("main-bower-files");
var runSequence = require("run-sequence");
var bufferToVinyl = require('buffer-to-vinyl');
var argv = require('yargs').argv;
var $ = require("gulp-load-plugins")({lazy: true});

//******************************************
// Run Build commands with --dev or --prod
//******************************************

gulp.task("default", function() {
    log("Building Development");
    runSequence("clean-tmp", "inject-default", "watch-default");
});

gulp.task("build", function() {
    log("Building Production");
    runSequence("clean-build", "inject-build");
});

//******************************************
// Build Development
//******************************************

gulp.task("clean-tmp", function () {
    log("Cleaning directory .tmp/");

    return gulp.src(config.temp + "*", {read: false})
        .pipe($.clean());
});

gulp.task("concatCSS", function() {
    log("Concating application's css-files");

    return gulp.src(config.allcss)
        .pipe($.plumber())
        .pipe($.cssUrlAdjuster({
            replace: ["../images", "../../src/images"]
        }))
        .pipe($.concat(config.css))
        .pipe(gulp.dest(config.temp + "css"));
});

gulp.task("jshint", function() {
    log("Analyzing application's js-files with JSHint and JSCS");

    return gulp.src("./src/app/**/*.js")
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter("jshint-stylish", {verbose: true}))
        .pipe($.jshint.reporter("fail"));
});

gulp.task("baseUrl", function() {
    log("Environment base Url configuration");

    var environment;
    if (argv.dev) {
        environment = JSON.stringify(config.deploy.local);
    }
    if (argv.prod) {
        environment = JSON.stringify(config.deploy.production);
    }
    return bufferToVinyl.stream(new Buffer(environment), config.deploy.file)
        .pipe($.ngConfig("app", {
            createModule: false,
            wrap: '(function () {\n "use strict";\n <%= module %>})();'
        }))
        .pipe(gulp.dest(config.temp + "js"));
});

gulp.task("templateCache", function() {
    log("Creating AngularJS templateCache");

    return gulp.src(config.html)
        .pipe($.htmlmin({empty: true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp + "js"));
});

gulp.task("concatJS", ["templateCache", "baseUrl"], function() {
    log("Concating application's js-file");

    return gulp.src([config.alljs[0], config.alljs[1], config.templateCache.src, config.deploy.src])
        .pipe($.plumber())
        .pipe($.angularFilesort())
        .pipe($.concat(config.js))
        .pipe(gulp.dest(config.temp + "js"));
});

gulp.task("inject-default", ["concatCSS", "concatJS"], function() {
    log("Injecting bower's css-,js-files and app application's css-,js-files into the html");

    return gulp.src(config.index)
        .pipe($.inject(gulp.src(bowerFiles(), {read: false}), {name: "bower", relative: true}))
        .pipe($.inject(gulp.src([config.cssSrc, config.jsSrc], {read: false}), {relative: true}))
        .pipe(gulp.dest(config.client));
});

gulp.task("watch-default", function () {
    log("Watching application's css, js");

    $.watch([config.alljs[0], config.alljs[1], config.allcss], $.batch(function (events, done) {
        gulp.start("inject-default", done);
    }));
});

//******************************************
// Build Production
//******************************************

gulp.task("clean-build", function () {
    log("Cleaning directory build/");

    return gulp.src(config.build + "*", {read: false})
        .pipe($.clean());
});

gulp.task("minifyCSS", ["concatCSS"], function() {
    log("Minifing application's css");

    return gulp.src(config.cssSrc)
        .pipe($.plumber())
        .pipe($.cssUrlAdjuster({
            replace: ["../../src/images/", "../images/"]
        }))
        .pipe($.csso())
        .pipe($.rename(config.optimized.css))
        .pipe(gulp.dest(config.build + "css"));
});

gulp.task("minifyJS", ["concatJS"], function() {
    log("Minifing application's js");

    return gulp.src(config.jsSrc)
        .pipe($.plumber())
        .pipe($.uglify())
        .pipe($.rename(config.optimized.js))
        .pipe(gulp.dest(config.build + "js"));
});

gulp.task("vendorCSS", function() {
    log("Concating bower's css");

    return gulp.src(bowerFiles())
        .pipe($.plumber())
        .pipe($.filter("**/*.css"))
        .pipe($.concat(config.optimized.vendorcss))
        .pipe(gulp.dest(config.build + "css"));
});

gulp.task("vendorJS", function() {
    log("Concating bower's js");

    return gulp.src(bowerFiles())
        .pipe($.plumber())
        .pipe($.filter("**/*.js"))
        .pipe($.concat(config.optimized.vendorjs))
        .pipe(gulp.dest(config.build + "js"));
});

gulp.task("fonts", function() {
    log("Copying fonts");

    return gulp.src(bowerFiles())
        .pipe($.filter(["**/*.eot", "**/*.ttf", "**/*.svg", "**/*.woff", "**/*.woff2"]))
        .pipe(gulp.dest(config.build + "fonts"));
});

gulp.task("favicon", function(){
    log("Copying favicon");

    return gulp.src(config.favicon)
        .pipe(gulp.dest(config.build));
});

gulp.task("images", function(){
    log("Copying images");

    return gulp.src(config.images)
        .pipe(gulp.dest(config.build + "images"));
});

gulp.task("inject-build", ["minifyCSS", "minifyJS", "vendorCSS", "vendorJS", "fonts", "images", "favicon"], function() {
    log("Injecting the minifing vendor css, js and app css, js into the html");

    return gulp.src(config.index)
        .pipe($.htmlReplace({
            "css": ["css/" + config.optimized.vendorcss, "css/" + config.optimized.css],
            "js": ["js/" + config.optimized.vendorjs, "js/" + config.optimized.js]
        }))
        .pipe(gulp.dest(config.build));
});

function log(msg) {
    if (typeof(msg) === "object") {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}