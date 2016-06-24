(function() {
    "use strict";

    angular.module("app.admin")
        .directive("sameField", sameField);

    sameField.$inject = []; 

    function sameField() {       
        
        function compareFields (field, confirmField) {
            
            return !field || (field === confirmField);
        }

        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attr, mCtrl) {
                function validation(value) {
                    mCtrl.$setValidity("sameField", compareFields(attr.sameField, value));
                                        
                    return value;
                }
                mCtrl.$parsers.push(validation);
            }
        };
     }

})();