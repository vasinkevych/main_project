(function() {
    "use strict";

    angular.module("app.admin")
        .directive("imageLoad", imageLoad);

    imageLoad.$inject = [];

    function imageLoad() {
        var directive = {
            scope: {
                imageLoad: "="
            },
            link: function(scope, element) {
                element.bind("change", function(changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function(loadEvent) {
                        scope.$apply(function() {
                            scope.imageLoad = loadEvent.target.result;
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        };

        return directive;
    }
})();