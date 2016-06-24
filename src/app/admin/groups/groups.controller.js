(function() {
    "use strict";

    angular.module("app.admin.groups")
        .controller("GroupsController", GroupsController);

    GroupsController.$inject = ['groupsService', 'specialitiesService', 'facultiesService', 'PAGINATION', 'MESSAGE', '$stateParams', 'customDialog'];

    function GroupsController(groupsService, specialitiesService, facultiesService, PAGINATION, MESSAGE, $stateParams, customDialog) {
        var vm = this;
        vm.showError = false;                                    // responsible for showing Error message if no group is found
        vm.showFilterOverAction = true;                          // responsible for showing filter or action (create, update) panel
    // PAGINATION
        vm.currentPage = PAGINATION.CURRENT_PAGE;
        vm.maxSize = PAGINATION.PAGES_SHOWN;                     // maximum number of pages on pagination panel
        vm.entryLimit = PAGINATION.ENTITIES_RANGE_ON_PAGE;       // maximum items shown on page
    // Callbacks for communication with backend
        function _applyDataCallback(data) {                      // callback for getting groups data from backend
            vm.list = Array.isArray(data) ?  data : [];          // to prevent the error if picked speciality or faculty has no groups
            vm.totalItems = data.length;
        }
    // Restores form to pristine
        function restoreForm(form) {
            form.$setPristine();
        }
    // CRUD
        function activate() {                                    // loads all groups
            groupsService.getGroups().then(_applyDataCallback);
        }
        // delete group
        vm.removeGroup = function(group) {
            customDialog.openDeleteDialog(group.group_name).then(function() {
                groupsService.removeGroup(group.group_id).then(function(data) {
                    data.response.indexOf('error') !== -1 ? alert(MESSAGE.SAVE_ERROR) : console.log(MESSAGE.DEL_SUCCESS);
                    activate();
                })
            });
        };
        // update or create group
        vm.saveGroup = function(form) {
            customDialog.openConfirmationDialog().then(function() {
                groupsService.saveGroup(vm.group).then(function(data) {
                    vm.toggleFilterAction();
                    activate();
                })
            });
            restoreForm(form);
        };
        // get all the groups from chosen faculty (if faculty is not chosen, get all the groups from database)
        vm.getGroupsByFaculty = function(f_id) {
            vm.selectedSpeciality = null;                        // to reset select tag of specialities
            f_id == null ? activate() : groupsService.getGroupsByFaculty(f_id).then(_applyDataCallback);
        };
        // get by specialities
        vm.getGroupsBySpeciality = function(s_id) {
            vm.selectedFaculty = null;
            s_id == null ? activate() : groupsService.getGroupsBySpeciality(s_id).then(_applyDataCallback);
        };
    // THE GOAL OF THIS CODE IS TO RETURN ARRAYS WITH FACULTIES AND SPECIALITIES NAMES WITH THE INDEXES CORRESPONDING TO THEIR IDS
        vm.associativeSpeciality = {};
        vm.associativeFaculty = {};
        specialitiesService.getSpecialities().then(function(data) {
            vm.specialities = data;
            for (var i = 0; i < vm.specialities.length; i++) {
                vm.associativeSpeciality[+vm.specialities[i].speciality_id] = vm.specialities[i].speciality_name;
            }
        });
        facultiesService.getFaculties().then(function(data) {
            vm.faculties = data;
            for (var i = 0; i < vm.faculties.length; i++) {
                vm.associativeFaculty[+vm.faculties[i].faculty_id] = vm.faculties[i].faculty_name;
            }
        });
    // Manages states
        vm.state_id = $stateParams.entity_id;
        if ($stateParams.entity === 'speciality') {
            vm.showSpecialityTitle = true;
            vm.hideSelect = true;
            vm.getGroupsBySpeciality(vm.state_id);
        } else if ($stateParams.entity === 'faculty') {
            vm.showFacultyTitle = true;
            vm.hideSelect = true;
            vm.getGroupsByFaculty(vm.state_id);
        } else {
            activate();
        }
    // responsible for showing error message if not a single group was found in the database
        vm.checkForError = function() {
            if(document.getElementById('table')) {
                vm.showError = document.getElementById('table').children.length === 1;
            }
        };
    // switch between filter/search and create/update panels
        vm.toggleFilterAction = function(group) {
            vm.showFilterOverAction = !vm.showFilterOverAction;
            vm.group = group == null ? {} : group;
        };
    // gets headers for table-head cells
        vm.headers = groupsService.headers();
    // allow adding a group only if name, faculty and speciality are set
        vm.allowAdd = function() {
            if (vm.group !== undefined) {return !(vm.group.faculty_id && vm.group.speciality_id && vm.group.group_name);}
        }
    }
})();


