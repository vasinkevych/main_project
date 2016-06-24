(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .factory("subjectsService", subjectsService);

    subjectsService.$inject = ["$http", "$q", "PAGINATION", "BASE_URL", "URL", "testsService"];

    function subjectsService($http, $q, PAGINATION, BASE_URL, URL, testsService) {
        var service = {
            getSubjects: getSubjects,
            getAllSubjects: getAllSubjects,
            getOneSubject: getOneSubject,
            totalItems: totalItems,
            saveSubject: saveSubject,
            removeSubject: removeSubject,
            getHeader: getHeader
        };

        return service;

        function _successCallback(response) {
            return response.data;
        }
        function _errorCallback(response) {
            return response;
        }

        function _addSubject (subject){

            return $http.post(BASE_URL + URL.ENTITIES.SUBJECT + URL.ADD_ENTITY, subject)
                .then(_successCallback, _errorCallback);
        }

        function _editSubject(subject){

            return $http.post(BASE_URL + URL.ENTITIES.SUBJECT + URL.EDIT_ENTITY  + subject.subject_id, subject)
                .then(_successCallback, _errorCallback);
        }

        function getAllSubjects(){
            return $http.get(BASE_URL + URL.ENTITIES.SUBJECT + URL.GET_ENTITIES)
                .then(_successCallback, _errorCallback);
        }

        function getSubjects(currentRecordsRange){
            return $http.get(BASE_URL + URL.ENTITIES.SUBJECT + URL.GET_ENTITY_RANGE + PAGINATION.ENTITIES_RANGE_ON_PAGE + "/" + currentRecordsRange)
                .then(_successCallback, _errorCallback);
        }

        function getOneSubject(id) {
            return $http.get(BASE_URL + URL.ENTITIES.SUBJECT + URL.GET_ENTITIES + id)
                .then((function(result) {
                    return result.data[0];
                }), _errorCallback);
        }

        function totalItems(){
            var deferred = $q.defer();
            $http.get(BASE_URL + URL.ENTITIES.SUBJECT + URL.COUNT_ENTITY)
                .then(function (res){
                        if(res.status === 200 && res.data.numberOfRecords) {
                            deferred.resolve(res.data.numberOfRecords)
                        }else {
                            deferred.reject(res)
                        }
                    },
                    function(res){
                        deferred.reject (res);
                    });

            return deferred.promise;
        }

        function saveSubject(subject) {
            if (subject.subject_id === undefined) {

                return _addSubject(subject);
            } else {

                return _editSubject(subject);
            }
        }

        function _removeEmptySubject(subject) {

            return $http.get(BASE_URL + URL.ENTITIES.SUBJECT + URL.REMOVE_ENTITY + subject.subject_id)
                .then(_successCallback, _errorCallback);
        }

        function removeSubject (subject) {
            var urlCalls = [];
            var deferred = $q.defer();
            testsService.getTestsBySubject(subject.subject_id)
                .then(function (data) {

                    if(angular.isArray(data)){
                        angular.forEach(data, function (item) {
                            urlCalls.push(testsService.removeTest(item));
                        });

                        $q.all(urlCalls).then(function (res) {

                            _removeEmptySubject (subject).then(function (response) {
                                        deferred.resolve(response);
                                    })
                        }, function (res) {
                            deferred.resolve(res)
                        })

                    } else if (data.response === "no records") {

                        _removeEmptySubject (subject).then(function (res) {
                            deferred.resolve(res)
                        })
                    }
                });
            return deferred.promise;
        }

        function getHeader() {

            return ["Предмет", "Опис предмету"];
        }
    }

})();