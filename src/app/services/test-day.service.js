(function() {
    "use strict";

    angular.module("app")
        .factory("testDayService", testDayService);

    testDayService.$inject = ["authService", "studentsService", "groupsService", "userService"];

    function testDayService (authService, studentsService, groupsService, userService) {

        var service = {
            getTestDays: getTestDays
        };

        return service;

        function getTestDays() {
            return authService.isLogged().then(function(loggedUser) {
                return loggedUser;
            })
            .then(function(loggedUser) {
                var testDays = [];

                return studentsService.getStudentById(loggedUser.id).then(function(student) {
                    return student;
                }).then(function(student) {
                    return userService.getSchedules(student.group_id).then(function(schedules) {
                        schedules.forEach(function (schedule, index) {
                            var status = schedule.enabled ? 'full' : 'partially';
                            var eventDate = schedule.event_date;
                            var date = new Date(eventDate.substring(0, 4), eventDate.substring(5, 7) - 1, eventDate.substring(8, 10))
                            testDays[index] = {
                                date: date,
                                status: status
                            }
                        })
                        
                        return [testDays, student];
                    })
                })
            })
        }
    }
})();