(function() {
    "use strict";
    angular.module("app.admin.subjects")
        .service("TableHeadService", TableHeadService);

    TableHeadService.$inject = [];

    function TableHeadService () {
        this.getSubjectHeader = getSubjectHeader;
        this.getGroupHeader = getGroupHeader;
        this.getFacultyHeader = getFacultyHeader;

        function getSubjectHeader() {
            return ["Предмет <span class=\"sortorder\" ng-show=\"propertyName === 'phone'\" ng-class=\"{reverse: reverse}\"></span>", "Опис предмету"];
        }

        function getGroupHeader() {
            return ["Назва", "Факультет", "Спеціальність"];
        }

        function getFacultyHeader() {
            return ["Назва факультету", "Опис факультету"];
        }
    }
}());