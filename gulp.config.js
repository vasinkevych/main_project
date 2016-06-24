module.exports = function() {
    var client = "./src/";
    var clientApp = client + "app/";
    var temp = "./.tmp/";

    var config = {
        //** Deploy Environment **//
        deploy: {
            file: "config.js",
            local: {
                BASE_URL: "http://ec2-52-38-234-109.us-west-2.compute.amazonaws.com/"
            },
            production: {
                BASE_URL: "http://ec2-52-38-234-109.us-west-2.compute.amazonaws.com/"
            },
            src: temp + "js/config.js"
        },

        //** Files paths **//
        alljs: [clientApp + "**/*.js", "!" + clientApp + "**/*.spec.js"],
        allcss: clientApp + "**/*.css",
        build: "./build/",
        client: client,
        favicon: client + "favicon.ico",
        html: clientApp + "**/*.html",
        htmltemplates: clientApp + "**/*.html",
        images: client + "images/**/*.*",
        index: client + "index.html",
        temp: temp,

        //** not optimized files **//
        css: "styles.css",
        cssSrc: temp + "css/styles.css",
        js: "app.js",
        jsSrc: temp + "js/app.js",

        //** optimized files **//
        optimized: {
            js: "app.min.js",
            css: "styles.min.css",
            vendorcss: "vendor.min.css",
            vendorjs: "vendor.min.js"
        },

        //** template cache **//
        templateCache: {
            file: "templates.js",
            options: {
                module: "app",
                standAlone: false,
                root: "app/"
            },
            src: temp + "js/templates.js"
        }
    };

    return config;
};