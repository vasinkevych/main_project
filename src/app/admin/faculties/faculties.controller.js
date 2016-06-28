(function() {
    "use strict";

    angular.module("app.admin")
        .controller("FacultiesController", FacultiesController);

    FacultiesController.$inject = ["RequestService", "TableHeadService", "PAGINATION", "VALID", "MESSAGE", "customDialog", "URL"];

    function FacultiesController (RequestService, TableHeadService, PAGINATION, VALID, MESSAGE, customDialog, URL) {
        var vm = this;
        vm.showSaveForm = showSaveForm;
        vm.hideSaveForm = hideSaveForm;
        vm.saveFormCollapsed = true;
        vm.headElements = TableHeadService.getFacultyHeader();
        vm.saveFaculty = saveFaculty;
        vm.removeFaculty = removeFaculty;
        vm.minNameLength = VALID.MIN_NAME_LENGTH;
        vm.maxNameLength = VALID.MAX_NAME_LENGTH;
        vm.amountEntities = PAGINATION.ENTITIES_RANGE_ON_PAGE;
        vm.maxSize = PAGINATION.PAGES_SHOWN;
        vm.currentPage = PAGINATION.CURRENT_PAGE;
        vm.currentRecordsRange = 0;
        vm.pageChanged = pageChanged;

        var params = {
            entity: URL.ENTITIES.FACULTY,
            currentRecordsRange: vm.currentRecordsRange
        };

        activate();

        function activate() {

            RequestService.totalItems(URL.ENTITIES.FACULTY).then(function(quantity) {
                vm.totalItems = + quantity.numberOfRecords;
            });
            RequestService.getEntities(params).then(function(data) {
                if (Array.isArray(data)) {
                    vm.list = data;
                } else {
                    vm.list = [];
                }
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
                if (vm.faculty.faculty_id === undefined) {
                    RequestService.addEntity(URL.ENTITIES.FACULTY, vm.faculty).then(function (data) {
                        activate();
                        hideSaveForm();
                        vm.faculty = {};
                    })
                } else {
                    RequestService.editEntity(URL.ENTITIES.FACULTY, vm.faculty, vm.faculty.faculty_id).then(function (data) {
                        activate();
                        hideSaveForm();
                        vm.faculty = {};
                    })
                }
            });
        }

        function removeFaculty(faculty) {
            var message;
            customDialog.openDeleteDialog().then(function() {
                RequestService.removeEntity(URL.ENTITIES.FACULTY, faculty.faculty_id).then(function(res) {
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

        function pageChanged(){
            params.currentRecordsRange =(vm.currentPage - 1) *  PAGINATION.ENTITIES_RANGE_ON_PAGE;
            RequestService.getEntities(params).then(function(data) {
                vm.list = data;
            });
        }
    }
})();