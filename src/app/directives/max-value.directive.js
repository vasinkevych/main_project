
(function() {
    "use strict";

    angular.module("app.admin")
        .directive("maxValue", maxValue);

    maxValue.$inject = [];

    function maxValue() {
        var directive =  {
            require: 'ngModel',
            scope: {
                maxValue: '@',
                ngModel: '='
            },
            link: function(scope, element, attrs, ctrl){

                scope.$watch('maxValue', function(newVal){
                    validate(scope.ngModel, newVal, ctrl);
                });

                scope.$watch('ngModel', function(val){
                    validate(val, scope.maxValue);
                });

                function validate(thisVal, maxVal){
                    var currentValue = parseInt(thisVal);
                    var max = parseInt(maxVal);
                    if(currentValue > max){
                        ctrl.$setValidity('range', false);
                    } else {
                        ctrl.$setValidity('range', true);
                    }
                }
            }
        };

        return directive;
    }
})();