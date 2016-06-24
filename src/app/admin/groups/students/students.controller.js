(function() {
    "use strict";

    angular.module("app.admin.groups")
        .controller("StudentsController", StudentsController);

    StudentsController.$inject = ["$stateParams","studentsService", "groupsService", "customDialog", "PAGINATION", "MESSAGE"];

    function StudentsController($stateParams, studentsService, groupsService, customDialog, PAGINATION, MESSAGE) {
        var vm = this;
        vm.headElements = studentsService.getHeadElements();
        vm.currentRecordsRange = 0;
        vm.entitiesPerPage = PAGINATION.ENTITIES_RANGE_ON_PAGE;
        vm.maxSize = 3;
        vm.currentPage = 1;
        vm.currentRecordsRange = 0;
        vm.getItemsPerPage = getItemsPerPage;
        vm.group_id = $stateParams.group_id;
        vm.associativeGroups = {};
        vm.studentRemover = studentRemover;
        activate();

        function activate() {
            studentsService.getStudentsByGroupId($stateParams.group_id, vm.currentRecordsRange).then(function (data) {
                vm.totalList = data;
                getItemsPerPage();
                vm.totalItems = vm.totalList.length;
                if(vm.totalItems > PAGINATION.ENTITIES_RANGE_ON_PAGE) {
                    vm.showPagination = true;
                }
                else {
                    vm.showPagination = false
                }
            });
        }

        function studentRemover(student) {
            customDialog.openDeleteDialog(student.student_name).then(function(){
                studentsService.removeStudent(student).then(function (result) {
                    customDialog.openInformationDialog(MESSAGE.SAVE_SUCCSES, "Збережено").then(function () {
                        activate();
                    })
                })
            });
        }


        function getItemsPerPage() {
            vm.currentRecordsRange = (vm.currentPage - 1) * vm.entitiesPerPage;
            var end = vm.currentRecordsRange + vm.entitiesPerPage;
            vm.list = vm.totalList.slice(vm.currentRecordsRange, end);
        }

        groupsService.getGroups().then(function(data) {
            vm.groups = data;
            for (var i = 0; i < vm.groups.length; i++) {
                vm.associativeGroups[+vm.groups[i].group_id] = vm.groups[i].group_name;
            }
        });

    }
})();

