(function() {
    "use strict"; 

    angular.module("app.admin.subjects")
        .factory("schedulesService", schedulesService);

    schedulesService.$inject = ["$http", "BASE_URL", "URL"];

    function schedulesService($http, BASE_URL, URL) {
        var service = {
            getSchedulesForGroup:   getSchedulesForGroup,
            getSchedulesForSubject: getSchedulesForSubject,
            removeSchedule:         removeSchedule,
            saveSchedule:           saveSchedule
        };

        return service;

        // callbacks
        function _successCallback(result) {
            return result.data;
        }
        function _errorCallback(reason) {
            return reason;
        }
            // get schedule for a specific group
        function getSchedulesForGroup(group_id) {
            return $http.get(BASE_URL + URL.ENTITIES.TIME_TABLE + URL.GET_SCHEDULE_FOR_GROUP + group_id)
                .then(_successCallback, _errorCallback);
        }
            // get scedules for subject
        function getSchedulesForSubject(subject_id) {
            return $http.get(BASE_URL + URL.ENTITIES.TIME_TABLE + URL.GET_SCHEDULE_FOR_SUBJECT + subject_id)
                .then(_successCallback, _errorCallback);
        }
            // delete schedule from database
        function removeSchedule(schedule_id) {
            return $http.get(BASE_URL + URL.ENTITIES.TIME_TABLE + URL.REMOVE_ENTITY + schedule_id).then(_successCallback, _errorCallback);
        }
            // create/update
        function saveSchedule(schedule) {
            if (schedule.timetable_id === undefined) {
                return $http.post(BASE_URL + URL.ENTITIES.TIME_TABLE + URL.ADD_ENTITY, schedule).then(_successCallback, _errorCallback)
            } else {
                return $http.post(BASE_URL + URL.ENTITIES.TIME_TABLE + URL.EDIT_ENTITY + schedule.timetable_id, schedule).then(_successCallback, _errorCallback)
            }
        }
    }
})();