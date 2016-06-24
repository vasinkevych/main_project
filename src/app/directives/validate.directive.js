(function() {
    "use strict";

    angular.module("app.admin")
        .directive("validate", validate);

    validate.$inject = ["VALID", "specialitiesService", "adminService", "facultiesService"]; //inject your service (and const if it's needed)

    function validate(VALID, specialitiesService, adminService, facultiesService) {       //inject your service (and const if it's needed)
        var all;

        function getAll(inputName) {
            switch (inputName) {
                case "specialityName", "specialityCode" :
                    specialitiesService.getSpecialities().then(function(data) {
                        all = data;
                    });
                    break;
                case "facultyName", "facultyDesc" :
                    facultiesService.getFaculties().then(function(data) {
                        all = data;
                    });
                    break;
                case "username", "email" : 
                    adminService.getAdmins().then(function(data) {
                        all = data;
                    });
                //add your cases analogcally, your input's names must be different from existing above
                // and don't forget 'break'
            }
        }

        function validText(regexp, text) {
            return regexp.test(text);
        }

        function alreadyExist(arrObj, key, text){
            for (var i = 0; i < arrObj.length; i++) {
                if (arrObj[i][key] === text) {
                    return true;
                }
            }
            return false;
        }

        function whichInput(inputName){
            var attr = {};
            switch (inputName) {
                case "username" :
                    attr.regexp = VALID.USERNAME_REGEXP;
                    attr.key = "username";
                    return attr;
                case "email" :
                    attr.regexp = VALID.EMAIL_REGEXP;
                    attr.key = "email";
                    return attr;
                case "specialityName" :
                    attr.regexp = VALID.NAME_REGEXP;
                    attr.key = "speciality_name";
                    return attr;
                case "specialityCode" :
                    attr.regexp = VALID.CODE_REGEXP;
                    attr.key = "speciality_code";
                    return attr;
                case "facultyName" :
                    attr.regexp = VALID.NAME_REGEXP;
                    attr.key = "faculty_name";
                    return attr;
                case "facultyDesc" :
                    attr.regexp = VALID.NAME_REGEXP;
                    attr.key = "faculty_description";
                    return attr;
                //your cases here analogically////////////////////////////////////////////
            }
        }
// That is it!!! Don't change anything else here! Put word "validate" in your inputs in html and enjoy!
// You can use also form.inputName.&error.validText or form.inputName.&error.alreadyExist to show error-massages in your forms
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attr, mCtrl) {
                getAll(attr.name);
                function validation(value) {
                    mCtrl.$setValidity("validText", validText(whichInput(attr.name).regexp, value));
                    mCtrl.$setValidity("alreadyExist", !alreadyExist(all, whichInput(attr.name).key, value));
                    
                    return value;
                }
                mCtrl.$parsers.push(validation);
            }
        };
     }

})();