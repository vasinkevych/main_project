(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .controller("SubjectsController", SubjectsController);

    SubjectsController.$inject = ["RequestService", "orderByFilter", "URL", "PAGINATION", "customDialog"];

    function SubjectsController (RequestService, orderBy, URL, PAGINATION, customDialog) {
        var vm = this;
        vm.formCollapsed = true;
        vm.hideForm = hideForm;
        vm.showForm = showForm;
        vm.saveEntity = saveSubject;
        vm.removeSubject = removeSubject;
        vm.entitiesPerPage = PAGINATION.ENTITIES_RANGE_ON_PAGE;
        vm.maxSize = PAGINATION.PAGES_SHOWN;
        vm.currentPage = 1;
        vm.currentRecordsRange = 0;
        vm.pageChanged = pageChanged;
        //===================================================
        // Sorting
        vm.sortBy = sortBy;
        vm.propertyName = "subject_name";
        vm.reverse = true;
        vm.list = [];

         function sortBy (propertyName) {
            vm.propertyName = propertyName;
            console.log(propertyName);
            vm.reverse = (propertyName !== null && vm.propertyName === propertyName)
                ? !vm.reverse : false;
             vm.list = orderBy(vm.list, vm.propertyName, vm.reverse, StringLengthComparator(vm.list));
        };

        function StringLengthComparator (list) {
           //return list.sort(function (item1, item2) {
        };

        //===================================================

        var params = {
            entity: URL.ENTITIES.SUBJECT,
            currentRecordsRange: vm.currentRecordsRange
        };

        activate();

        function activate() {

            RequestService.totalItems(URL.ENTITIES.SUBJECT).then(function (quantity) {
                vm.totalItems = + quantity.numberOfRecords;
                if (vm.totalItems > PAGINATION.ENTITIES_RANGE_ON_PAGE) {
                    vm.showPagination = true;
                } else {
                    vm.showPagination = false
                }
            });
            RequestService.getEntities(params).then(function (data) {
                if (Array.isArray(data)) {
                    vm.list =  orderBy(data, vm.propertyName, vm.reverse, StringLengthComparator(data));
                } else {
                    vm.list = [];
                }
            })
        }

        function hideForm() {
            vm.formCollapsed = true;
        }

        function saveSubject () {
            customDialog.openConfirmationDialog().then(function() {
                if (vm.subject.subject_id === undefined) {
                    RequestService.addEntity(URL.ENTITIES.SUBJECT, vm.subject).then(function (data) {
                        activate();
                        hideForm();
                        vm.subject = {};
                    })
                } else {
                    RequestService.editEntity(URL.ENTITIES.SUBJECT, vm.subject, vm.subject.subject_id).then(function (data) {
                        activate();
                        hideForm();
                        vm.subject = {};
                    })
                }
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
                RequestService.removeEntity(URL.ENTITIES.SUBJECT, subject.subject_id).then(function (res) {
                    activate();
                });
            });
        }


        function pageChanged () {
            params.currentRecordsRange =(vm.currentPage - 1) * vm.entitiesPerPage;
            RequestService.getEntities(params).then(function (data) {
                vm.list = orderBy(data, vm.propertyName, vm.reverse, StringLengthComparator(data));
            });
        }
    }
})();