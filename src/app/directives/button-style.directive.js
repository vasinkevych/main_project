(function() {
    "use strict";

    angular.module("app.user")
        .directive("buttonStyle", buttonStyle);

    buttonStyle.$inject = [];

    function buttonStyle() {
        var directive = {
            link: function ($scope, element) {
                element.bind("click", function () {
                    element.css("background-color", "teal");
                });
            }
        };

        return directive;
    }
})();