(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .factory("testsService", testsService);

    testsService.$inject = ["$http", "BASE_URL", "URL"];

    function testsService($http, BASE_URL, URL) {
        var service = {
            getTests: getTests,
            getTestsBySubject: getTestsBySubject,
            getOneTest: getOneTest,
            saveTest: saveTest,
            removeTest: removeTest,
            getHeader: getHeader,
            getStatus: getStatus,
            getTestLevel: getTestLevel,
            saveTestLevel: saveTestLevel,
            removeTestLevel: removeTestLevel,
            getLevel: getLevel,
            availableTasks: availableTasks,
            getHeaderTestDetail: getHeaderTestDetail
        };

        return service;

        function _successCallback(response) {
            return response.data;
        }

        function _errorCallback(response) {
            return response;
        }

        function _addTest (test){

            return $http.post(BASE_URL + URL.ENTITIES.TEST + URL.ADD_ENTITY, test)
                .then(_successCallback, _errorCallback);
        }

        function _editTest (test) {

            return $http.post(BASE_URL + URL.ENTITIES.TEST + URL.EDIT_ENTITY + test.test_id, test)
                .then(_successCallback, _errorCallback);
        }

        function getTests () {

            return $http.get(BASE_URL + URL.ENTITIES.TEST + URL.GET_ENTITIES)
                .then(_successCallback, _errorCallback);
        }

        function getTestsBySubject (subjectId) {

            return $http.get(BASE_URL + URL.ENTITIES.TEST + URL.GET_TEST_BY_SUBJECT + subjectId)
                .then(_successCallback, _errorCallback);
        }

        function getOneTest (id) {

            return $http.get(BASE_URL + URL.ENTITIES.TEST + URL.GET_ENTITIES + id)
                .then(_successCallback, _errorCallback);
        }

        function saveTest(test) {
            if (test.test_id === undefined) {

                return _addTest(test);
            } else {

                return _editTest(test);
            }
        }

        function removeTest (test) {

            return $http.get(BASE_URL + URL.ENTITIES.TEST + URL.REMOVE_ENTITY + test.test_id)
                .then(_successCallback, _errorCallback);
        }

        function getHeader() {

            return ["Назва тесту", "Завдань", "Тривалість", "Статус", "Спроб"];
        }

        function getStatus() {
            var status = [{
                value: 0,
                enabled: "Недоступно"
            },{
                value: 1,
                enabled: "Доступно"
            }];

            return status;
        }

        //ТESTS-DETAILS

        function _addTestLevel (testLevel){

            return $http.post(BASE_URL + URL.ENTITIES.TEST_DETAIL + URL.ADD_ENTITY, testLevel)
                .then(_successCallback, _errorCallback);
        }

        function _editTestLevel (testLevel) {

            return $http.post(BASE_URL + URL.ENTITIES.TEST_DETAIL + URL.EDIT_ENTITY + testLevel.id, testLevel)
                .then(_successCallback, _errorCallback);
        }

        function getTestLevel (id) {
            return $http.get(BASE_URL + URL.ENTITIES.TEST_DETAIL + URL.GET_TEST_DETAILS + "/" + id)
                .then(_successCallback, _errorCallback);
        }
        function saveTestLevel(testLevel) {
            if (testLevel.id === undefined) {

                return _addTestLevel(testLevel);
            } else {

                return _editTestLevel(testLevel);
            }
        }

        function removeTestLevel (id) {

            return $http.get(BASE_URL + URL.ENTITIES.TEST_DETAIL + URL.REMOVE_ENTITY + id)
                .then(_successCallback, _errorCallback);
        }

        /**
         * This function filtered available level for select tag.
         * @param {array} arrTestDetail is array of objects with properties.
         * @returns {array} availableLevel is the array with available level in select tag.
         */

        function getLevel (arrTestDetail){
            var level = [];
            var usedLevel = [];
            if(Array.isArray(arrTestDetail)){
                arrTestDetail.forEach(function(item){
                    usedLevel.push(item.level);
                })}
            for (var i = 1; i <= 7; i++){
                level.push(i);
            }
            var availableLevel = level.filter(function(itemLevel){

                return usedLevel.every(function (usedItem) {
                    return usedItem != itemLevel;
                });
            });

            return availableLevel;
        }

        /**
         * This function count how many tasks are available.
         * @param {array } arrTestDetail is array of objects with properties for current level.
         * @param {number} maxQuantytyOfTasks gets from object currentTest.
         * @returns {number} how many tasks are available.
         */

        function availableTasks (arrTestDetail, maxQuantytyOfTasks){
            var countOfUsedTasks = 0;
            if(Array.isArray(arrTestDetail)){
                arrTestDetail.forEach(function(item){
                    countOfUsedTasks += parseInt(item.tasks);
                })}

            return (parseInt(maxQuantytyOfTasks) - countOfUsedTasks);
        }

        function getHeaderTestDetail() {

            return ["Номер рівня", "Кількість завдань", "Кількість балів"];
        }
    }
})();