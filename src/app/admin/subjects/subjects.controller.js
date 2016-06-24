(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .controller("SubjectsController", SubjectsController);

    SubjectsController.$inject = ["subjectsService", "PAGINATION", "customDialog"];

    function SubjectsController (subjectsService, PAGINATION, customDialog) {
        var vm = this;
        vm.headElements = subjectsService.getHeader();
        vm.formCollapsed = true;
        vm.hideForm = hideForm;
        vm.showForm = showForm;
        vm.saveEntity = saveEntity;
        vm.removeSubject = removeSubject;
        vm.entitiesPerPage = PAGINATION.ENTITIES_RANGE_ON_PAGE;
        vm.maxSize = PAGINATION.PAGES_SHOWN;
        vm.currentPage = 1;
        vm.currentRecordsRange = 0;
        vm.pageChanged = pageChanged;
        activate();

        function activate() {
            subjectsService.totalItems().then(function (quantity) {
                vm.totalItems = +quantity;
                if (vm.totalItems > PAGINATION.ENTITIES_RANGE_ON_PAGE) {
                    vm.showPagination = true;
                } else {
                    vm.showPagination = false
                }
            });
            subjectsService.getSubjects(vm.currentRecordsRange).then(function (data) {
                if (Array.isArray(data)) {
                    vm.list = data;
                } else {
                    vm.list = [];
                }
            })}

        function hideForm() {
            vm.formCollapsed = true;
        }

        function saveEntity () {
            customDialog.openConfirmationDialog().then(function() {
                subjectsService.saveSubject(vm.subject).then(function (data) {

                    activate();
                    hideForm();
                    vm.subject = {};
                })
            });
        }
 
        function showForm(subject) {
            vm.formCollapsed = false;
            if (subject === undefined) {
                vm.subject = {}
            } else {
                vm.subject = subject;
            }
        }

        function removeSubject(subject) {
            customDialog.openDeleteDialog(subject).then(function(){
                subjectsService.removeSubject(subject).then(function (res) {
                    activate();
                })
            });
        }

      
        function pageChanged () {
            vm.currentRecordsRange =(vm.currentPage - 1) * vm.entitiesPerPage;
            subjectsService.getSubjects(vm.currentRecordsRange).then(function (data) {
                vm.list = data;
            });
        }
    }
})();