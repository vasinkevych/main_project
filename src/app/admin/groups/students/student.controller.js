(function() {
    "use strict";

    angular.module("app.admin.groups")
        .controller("StudentController", StudentController);

    StudentController.$inject = ["$stateParams", "studentsService", "groupsService", "customDialog", "$state", "MESSAGE"];

    function StudentController($stateParams, studentsService, groupsService, customDialog, $state, MESSAGE) {
        var vm = this;
        vm.addOrEdit = addOrEdit;
        vm.addNewStudent = addNewStudent;
        vm.editStudent = editStudent;
        vm.allowAdd = allowAdd;
        vm.reset = reset;
        vm.expression = false;
        vm.showElements = false;
        vm.getRandomPas = getRandomPas;
        vm.addElements = true;
        vm.additionalInputs = true;
        vm.disableInputs = false;
        vm.editElements = false;
        vm.editAndAddElement = false;
        vm.group_id = $stateParams.group_id;
        vm.student_id = $stateParams.student_id;
        vm.showAndEditElements = false;
        vm.associativeGroups = {};
        vm.newStudent = getEmptyStudent();
        activate();

        function activate() {
            if ($stateParams.content_type === "show" || $stateParams.content_type === "edit") {
                return studentsService.getStudentById($stateParams.student_id).then(function (response) {
                    vm.editElements = $stateParams.content_type === "edit";
                    vm.disableInputs = $stateParams.content_type === "show";
                    vm.showAndEditElements = true;
                    vm.editElement = $stateParams.content_type === "edit";
                    vm.additionalInputs = $stateParams.content_type === "edit";
                    vm.addElements = false;
                    vm.showElements = $stateParams.content_type === "show";
                    vm.newStudent = {
                        username: response.username || "",
                        password: response.plain_password,
                        password_confirm: response.plain_password,
                        email: response.email || "",
                        gradebook_id: response.gradebook_id,
                        student_surname: response.student_surname,
                        student_name: response.student_name,
                        student_fname: response.student_fname,
                        group_id: response.group_id,
                        plain_password: response.plain_password,
                        photo: response.photo
                    };

                    return vm.newStudent;
                });
            }
        }

        function getEmptyStudent(){
            return {
                username: "",
                password: "",
                password_confirm: "",
                email: "",
                gradebook_id: "",
                student_surname: "",
                student_name: "",
                student_fname: "",
                group_id: "" + vm.group_id,
                plain_password: "",
                photo: ""
            };
        }

        function getRandomPas() {
            vm.newStudent.plain_password = Math.random().toString(36).slice(-8);
        }

        function addOrEdit() {
            if (angular.isUndefined(vm.student_id)) {
                addNewStudent();
            } else {
                editStudent();
            }
        }

        function addNewStudent() {
            if ($stateParams.content_type === "add") {
                vm.addElement = $stateParams.content_type === "add";
                vm.newStudent.password = vm.newStudent.plain_password;
                vm.newStudent.password_confirm = vm.newStudent.plain_password;
                studentsService.addStudent(vm.newStudent).then(function (data) {
                    customDialog.openInformationDialog(MESSAGE.SAVE_SUCCSES, "Збережено").then(function () {
                        vm.newStudent = getEmptyStudent();
                        var studentImage = document.getElementById("studentImage");
                        studentImage.removeAttribute("src");
                    })
                })
            }
        }

        function editStudent() {
            customDialog.openConfirmationDialog().then(function() {
                vm.newStudent.password = vm.newStudent.plain_password;
                vm.newStudent.password_confirm = vm.newStudent.plain_password;
                studentsService.editStudent(vm.newStudent, $stateParams.student_id).then(function (response) {
                    customDialog.openInformationDialog(MESSAGE.SAVE_SUCCSES, "Збережено").then(function () {
                        $state.go("admin.student", {
                            group_id: vm.group_id,
                            content_type: 'show',
                            student_id: vm.student_id
                        });
                        vm.editElements = true;
                        vm.addElements = false;
                        vm.additionalInputs = true;
                        vm.newStudent = {
                            username: response.username,
                            password: response.password,
                            password_confirm: response.password_confirm,
                            email: response.email,
                            gradebook_id: response.gradebook_id,
                            student_surname: response.student_surname,
                            student_name: response.student_name,
                            student_fname: response.student_fname,
                            group_id: response.group_id,
                            plain_password: response.plain_password,
                            photo: response.photo
                        };
                    })
                })
            });
        }

        function allowAdd() {
            if (vm.newStudent !== undefined) {

                return !(vm.newStudent.username && vm.newStudent.plain_password && vm.newStudent.email && vm.newStudent.gradebook_id && vm.newStudent.student_surname && vm.newStudent.student_name && vm.newStudent.student_fname && vm.newStudent.group_id && vm.newStudent.photo);
            }
        }

        groupsService.getGroups().then(function(data) {
            vm.groups = data;
            for (var i = 0; i < vm.groups.length; i++) {
                vm.associativeGroups[+vm.groups[i].group_id] = vm.groups[i].group_name;
            }
        });

        function reset(actionForm) {
            actionForm.$setPristine();
        }

    }
})();