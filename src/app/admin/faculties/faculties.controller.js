(function() {
    "use strict";

    angular.module("app.admin")
        .controller("FacultiesController", FacultiesController);

    FacultiesController.$inject = ["facultiesService", "PAGINATION", "VALID", "MESSAGE", "customDialog"];

    function FacultiesController (facultiesService, PAGINATION, VALID, MESSAGE, customDialog) {
        var vm = this;
        vm.showSaveForm = showSaveForm;
        vm.hideSaveForm = hideSaveForm;
        vm.saveFormCollapsed = true;
        vm.headElements = facultiesService.getHeader();
        vm.saveFaculty = saveFaculty;
        vm.removeFaculty = removeFaculty;
        vm.minNameLength = VALID.MIN_NAME_LENGTH;
        vm.maxNameLength = VALID.MAX_NAME_LENGTH;
        vm.amountEntities = PAGINATION.ENTITIES_RANGE_ON_PAGE;
        vm.maxSize = PAGINATION.PAGES_SHOWN;
        vm.currentPage = PAGINATION.CURRENT_PAGE;
        vm.currentRecordsRange = 0;
        vm.pageChanged = pageChanged;
        activate();

        function activate() {
            facultiesService.totalItems().then(function(quantity) {
                vm.totalItems = +quantity;
            });
            facultiesService.getFacultiesRange(vm.currentRecordsRange).then(function(data) {
                vm.list = data;
            });
        }

        function showSaveForm(faculty) {
            vm.saveFormCollapsed = false;
            if (faculty === null) {
                vm.faculty = {};
            } else {
                vm.faculty = faculty;
            }
        }
        function hideSaveForm() {
            vm.saveFormCollapsed = true;
            vm.faculty = {};
        }

        function saveFaculty() {
            customDialog.openConfirmationDialog().then(function() {
                facultiesService.saveFaculty(vm.faculty).then(function(res) {
                    customDialog.openInformationDialog(MESSAGE.SAVE_SUCCSES, "Збережено").then(function() {
                        activate();
                        vm.hideSaveForm();
                    });
                });
            });
        }

        function removeFaculty(faculty) {
            var message;
            customDialog.openDeleteDialog().then(function() {
                facultiesService.removeFaculty(faculty.faculty_id).then(function(res) {
                    if (res.response.indexOf("error") > -1) {
                        customDialog.openInformationDialog(MESSAGE.DEL_SPEC_ERR, "Відхилено");
                    } else {
                        customDialog.openInformationDialog(MESSAGE.DEL_SUCCESS, "Збережено").then(function() {
                            activate();
                        });
                    }
                });
            });
        }

        function getNextRange() {
            vm.currentRecordsRange =(vm.currentPage - 1) * PAGINATION.ENTITIES_RANGE_ON_PAGE;
        }

        function pageChanged(){
            getNextRange();
            facultiesService.getFacultiesRange(vm.currentRecordsRange).then(function(data) {
                vm.list = data;
            });
        }
    }
})();