(function() {
    "use strict";

    angular.module("app.admin")
        .directive("myDatePicker", myDatePicker);

    myDatePicker.$inject = [];

    function myDatePicker() {
        var directive =  {
            restrict: "E",
            scope:{
                ngModel: "=",
                dateOptions: "=",
                opened: "="
            },
            link: function($scope, element, attrs) {
                $scope.open = function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $scope.opened = true;
                };

                $scope.clear = function () {
                    $scope.ngModel = null;
                };
            },
            templateUrl: 'app/directives/datepicker.template.html'
        };

        return directive;
    }
})();