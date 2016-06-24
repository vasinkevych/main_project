(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .controller("SchedulesController", SchedulesController);

    SchedulesController.$inject = ['schedulesService', 'groupsService', 'subjectsService', '$stateParams', 'MESSAGE', 'customDialog'];

    function SchedulesController(schedulesService, groupsService, subjectsService, $stateParams, MESSAGE, customDialog) {
        var vm = this;
        vm.schedule = {};
        vm.associativeGroups = {};
        vm.associativeSubjects = {};
        vm.entity = $stateParams.entity;
        vm.entity_id = $stateParams.entity_id;
        function activate() {
            if (vm.entity === 'group') {
                schedulesService.getSchedulesForGroup(vm.entity_id).then(_applyDataCallback);
                vm.schedule.group_id = vm.entity_id;
                groupsService.getGroup(vm.entity_id)
                    .then(function(data) {
                        vm.group = data;
                    })
            } else {
                schedulesService.getSchedulesForSubject(vm.entity_id).then(_applyDataCallback);
                vm.schedule.subject_id = vm.entity_id;
                subjectsService.getOneSubject(vm.entity_id)
                    .then(function(data) {
                        vm.subject = data;
                    })
            }
        }

        activate();

    // Callbacks for communication with backend
        function _applyDataCallback(data) {                      // callback for getting groups data from backend
            vm.list = Array.isArray(data) ?  data : [];          // to prevent the error if picked speciality or faculty has no groups
            vm.totalItems = data.length;
        }
    // CRUD
            // delete schedule
        vm.removeSchedule = function(schedule_id) {
            customDialog.openDeleteDialog(schedule_id).then(function() {
                schedulesService.removeSchedule(schedule_id).then(function(data) {
                    console.log(MESSAGE.DEL_SUCCESS);
                    activate();
                })
            });
        };
            // save new or edited
        vm.saveSchedule = function() {
            customDialog.openConfirmationDialog().then(function() {
                vm.formData.date.setDate(vm.formData.date.getDate() + 1);
                vm.schedule.event_date = vm.formData.date.toISOString().substring(0,10);
                schedulesService.saveSchedule(vm.schedule).then(function(data) {
                    vm.toggleActionForm();
                    activate();
                })
            });
        };
    // to make associative groups and subject for convinient select tag
        groupsService.getGroups().then(function(data) {
            vm.groups = data;
            for (var i = 0; i < vm.groups.length; i++) {
                vm.associativeGroups[+vm.groups[i].group_id] = vm.groups[i].group_name;
            }
        });
        subjectsService.getAllSubjects().then(function(data) {
            vm.subjects = data;
            for (var i = 0; i < vm.subjects.length; i++) {
                vm.associativeSubjects[+vm.subjects[i].subject_id] = vm.subjects[i].subject_name;
            }
        });
    // toggles action form and chsnges it's models for every ocasion
        vm.toggleActionForm = function(schedule) {
            if (schedule == null) {
                vm.schedule = {};
                vm.formData.date = "";
                if (vm.entity === 'group') {
                    vm.schedule.group_id = vm.entity_id;
                } else {
                    vm.schedule.subject_id = vm.entity_id;
                }
            } else {
                vm.schedule = schedule;
                var date = vm.schedule.event_date;
                vm.formData.date = new Date(date.substring(0, 4), date.substring(5, 7) - 1, date.substring(8, 10));
            }
            vm.showActionForm = !vm.showActionForm;
        };
    // DATEPICKER
        vm.formData = {};
        vm.formData.date = "";
        vm.opened = false;
        function disabledSunday(item) { // can't appoint exams on Sundays
            var date = item.date,
                mode = item.mode;
            return mode === 'day' && (date.getDay() === 0);
        }
        vm.dateOptions = {
            showWeeks: false,
            startingDay: 1,
            dateDisabled: disabledSunday,
            minDate: new Date()
        };
    }
})();