(function() {
    "use strict";

    angular.module("app.user")
        .controller("UserSubjectsController", UserSubjectsController);

    UserSubjectsController.$inject = ["userService", "customDialog", "$state", "testPlayerService"];

    function UserSubjectsController(userService, customDialog, $state, testPlayerService) {
        var vm = this;
        vm.headElements = userService.getHeaderSubjects();
        vm.showAvailableTests = showAvailableTests;

        activate();


        function activate() {
            userService.getCurrentUser().then(function(user) {
                    vm.currentUser = user;
                    return user;
                })
                .then(function(user) {
                    userService.getSchedules(user.group_id).then(function(response) {
                        vm.list = response;
                    })
                })
        }

        function showAvailableTests(subject) {
            vm.currentSubject = subject;
            userService.getAvailableTests(subject.subject_id).then(function(response) {
                vm.availableTest = response;
                if (vm.availableTest.length !== 0) {
                    customDialog.openChooseTestDialog(vm.currentSubject.subject_name, vm.availableTest)
                        .then(function(response) {
                            testPlayerService.getTest(+response).then(function(response) {
                                $state.go("user.testPlayer");
                            });
                        });
                } else {
                    customDialog.openInformationDialog("Ви використали усі спроби здачі тесту з цього предмету!").then();
                }
            });
        }
    }
})();