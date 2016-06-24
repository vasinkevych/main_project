(function() {
    "use strict";

    angular.module("app.user")
        .controller("HomeUserController", HomeUserController);
    
    HomeUserController.$inject = ["$scope","authService", "studentsService", "groupsService", "testDayService"];

    function HomeUserController($scope, authService, studentsService, groupsService, testDayService) {
        var vm = this;
        vm.showCalendar = true;
        vm.calendarLoaded = false;

        testDayService.getTestDays().then(function(response) {
            vm.testDays = response[0];
            vm.calendarLoaded = true;
            return response[1];
        }).then(function(user) {
            vm.user = user;
            groupsService.getGroup(vm.user.group_id).then(function(response) {
                vm.group = response;
            })
        })

        vm.options = {
            customClass: getDayClass,
            showWeeks: false
        };

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < vm.testDays.length; i++) {
                    var currentDay = new Date(vm.testDays[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return vm.testDays[i].status;
                    }
                }
            }

            return '';
        }
    }
})();