(function() {
    "use strict";

    angular.module("app.admin")
        .factory("facultiesService", facultiesService);

    facultiesService.$inject = ["$http", "$q", "BASE_URL", "URL", "PAGINATION"];

    function facultiesService($http, $q, BASE_URL, URL, PAGINATION) {
        var service = {
            getFacultiesRange: getFacultiesRange,
            getFaculties: getFaculties,
            saveFaculty: saveFaculty,
            removeFaculty: removeFaculty,
            totalItems: totalItems,
            getHeader: getHeader
        };

        return service;

        function _successCallback(result) {

            return result.data;
        }

        function _errorCallback(reason) {

            return reason;
        }

        function getFacultiesRange(currentRecordsRange) {
            var deferred = $q.defer();
            $http.get(BASE_URL + URL.ENTITIES.FACULTY + URL.GET_ENTITY_RANGE + PAGINATION.ENTITIES_RANGE_ON_PAGE + "/" + currentRecordsRange)
                .then(function(res) {
                        deferred.resolve(res.data);
                    },
                    function(res) {
                        deferred.reject(res);
                    });

            return deferred.promise;
        }

        function getFaculties() {
            var deferred = $q.defer();
            $http.get(BASE_URL + URL.ENTITIES.FACULTY + URL.GET_ENTITIES)
                .then(function(res) {
                        deferred.resolve(res.data);
                    },
                    function(res) {
                        deferred.reject(res);
                    });

            return deferred.promise;
        }

        function totalItems() {
            var deferred = $q.defer();
            $http.get(BASE_URL + URL.ENTITIES.FACULTY + URL.COUNT_ENTITY)
                .then(function(res){
                        if(res.status === 200) {
                            deferred.resolve(res.data.numberOfRecords)
                        }
                    },
                    function(res){
                        deferred.reject(res);
                    });

            return deferred.promise;
        }

        function saveFaculty(faculty) {
            if (faculty.faculty_id === undefined) {

                return _addFaculty(faculty);
            } else {

                return _editFaculty(faculty);
            }
        }

        function _addFaculty(faculty) {

            return $http.post(BASE_URL + URL.ENTITIES.FACULTY + URL.ADD_ENTITY, faculty)
                .then(_successCallback, _errorCallback);
        }

        function _editFaculty(faculty) {

            return $http.post(BASE_URL + URL.ENTITIES.FACULTY + URL.EDIT_ENTITY + faculty.faculty_id, faculty)
                .then(_successCallback, _errorCallback);
        }

        function removeFaculty(id) {

            return $http.get(BASE_URL + URL.ENTITIES.FACULTY + URL.REMOVE_ENTITY + id)
                .then(_successCallback, _errorCallback);
        }

        function getHeader() {

            return ["Назва факультету", "Опис факультету"];
        }
    }

})();