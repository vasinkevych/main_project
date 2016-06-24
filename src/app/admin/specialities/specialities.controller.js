(function() {
    "use strict";

    angular.module("app.admin")
        .controller("SpecialitiesController", SpecialitiesController);

    SpecialitiesController.$inject = ["specialitiesService", "customDialog", "PAGINATION", "VALID", "MESSAGE"];

    function SpecialitiesController (specialitiesService, customDialog, PAGINATION, VALID, MESSAGE) {
        var vm = this;
        vm.showSaveForm = showSaveForm;
        vm.hideSaveForm = hideSaveForm;
        vm.saveFormCollapsed = true;
        vm.saveSpeciality = saveSpeciality;
        vm.headElements = specialitiesService.getHeader();       
        vm.removeSpeciality = removeSpeciality;
        vm.minNameLength = VALID.MIN_NAME_LENGTH;
        vm.maxNameLength = VALID.MAX_NAME_LENGTH;
        vm.amountRecords = PAGINATION.ENTITIES_RANGE_ON_PAGE;
        vm.maxSize = PAGINATION.PAGES_SHOWN;
        vm.currentPage = PAGINATION.CURRENT_PAGE;
        vm.currentRecordsRange = 0;
        vm.pageChanged = pageChanged;
        
        activate();

        function activate() {
            specialitiesService.totalItems().then(function(quantity) {
                vm.totalItems = +quantity;
            });
            specialitiesService.getSpecialitiesRange(vm.currentRecordsRange).then(function(data) {
                vm.list = data;
            });
        }

        function showSaveForm(speciality) {
            vm.saveFormCollapsed = false;
            vm.speciality = (speciality === null) ? {} : speciality;
        }
        
        function hideSaveForm() {
            vm.saveFormCollapsed = true;
            vm.speciality = {};
        }

        function saveSpeciality() {
            customDialog.openConfirmationDialog().then(function() {
                specialitiesService.saveSpeciality(vm.speciality).then(function(res) {
                    customDialog.openInformationDialog(MESSAGE.SAVE_SUCCSES, "Збережено").then(function() {
                        activate();
                        vm.hideSaveForm();
                    });    
                });
            });
        }

        function removeSpeciality(speciality) {
            var message;
            customDialog.openDeleteDialog().then(function() {
                specialitiesService.removeSpeciality(speciality.speciality_id).then(function(res) {
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
            vm.currentRecordsRange =(vm.currentPage - 1) * vm.amountRecords;
            specialitiesService.getSpecialitiesRange(vm.currentRecordsRange).then(function(data) {
                vm.list = data;
            });
        }
    }
})();