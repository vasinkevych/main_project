(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .factory("questionsService", questionsService);

    questionsService.$inject = ["$http", "$q", "BASE_URL", "URL", "PAGINATION", "TYPES_OF_QUESTION", "MESSAGE", "customDialog"];

    function questionsService($http, $q, BASE_URL, URL, PAGINATION, TYPES_OF_QUESTION, MESSAGE, customDialog) {
        var service = {
            getQuestionsRange: getQuestionsRange,
            getCountQuestionsByTest: getCountQuestionsByTest,
            getOneQuestion: getOneQuestion,
            getQuestionsByTest: getQuestionsByTest,
            saveQuestion: saveQuestion,
            removeQuestion: removeQuestion,
            getHeader: getHeader,
            getLevels: getLevels,
            getTypes: getTypes
        };

        return service;

        function _successCallback(response) {
            return response.data;
        }

        function _errorCallback(response) {
            return response;
        }

        function _successMessageCallback(response) {
            return customDialog.openInformationDialog(MESSAGE.SAVE_SUCCSES).then();
        }

        function _errorMessageCallback(response) {
            return customDialog.openInformationDialog(MESSAGE.SAVE_ERROR).then();
        }
        
        function _addQuestion(question) {
            return $http.post(BASE_URL + URL.ENTITIES.QUESTION + URL.ADD_ENTITY, question)
                .then(_successMessageCallback, _errorMessageCallback);
        }

        function _editQuestion(question) {
            return $http.post(BASE_URL + URL.ENTITIES.QUESTION + URL.EDIT_ENTITY + question.question_id, question)
                .then(_successMessageCallback, _errorMessageCallback);
        }

        function getQuestionsRange(currentRecordsRange, test_id) {
            return $http.get(BASE_URL + URL.ENTITIES.QUESTION + URL.GET_RECORDS_RANGE_BY_TEST + test_id + "/"
                + PAGINATION.ENTITIES_RANGE_ON_PAGE + "/" + currentRecordsRange + "/")
                .then(_successCallback, _errorCallback);
        }

        function getCountQuestionsByTest(test_id) {
            var deferred = $q.defer();
            $http.get(BASE_URL + URL.ENTITIES.QUESTION + URL.COUNT_RECORDS_BY_TEST + test_id)
                .then(function(response){
                        if(response.status === 200) {
                            deferred.resolve(response.data.numberOfRecords)
                        }
                    },
                    function(response){
                        deferred.reject(response);
                    });

            return deferred.promise;
        }

        function getQuestionsByTest(test_id) {
            return getCountQuestionsByTest(test_id).then(function(data) {
                if (data != 0) {
                    return $http.get(BASE_URL + URL.ENTITIES.QUESTION + URL.GET_RECORDS_RANGE_BY_TEST + test_id + "/"
                            + data + "/0/")
                        .then(_successCallback, _errorCallback);
                }
            });
        }

        function getOneQuestion(question_id) {
            return $http.get(BASE_URL + URL.ENTITIES.QUESTION + URL.GET_ENTITIES + question_id)
                .then(_successCallback, _errorCallback);
        }
        
        function saveQuestion(question, test_id) {
            if (question.question_id === undefined) {
                question.test_id = test_id;
                if (question.attachment === undefined) {
                    question.attachment = "";
                }
                return _addQuestion(question);
            } else {
                return _editQuestion(question);
            }
        }

        function removeQuestion(question_id) {
            return $http.get(BASE_URL + URL.ENTITIES.QUESTION + URL.REMOVE_ENTITY + question_id)
                .then(function(response) {
                    if (response.data.response === "ok") {
                        customDialog.openInformationDialog(MESSAGE.DEL_SUCCESS).then();
                    } else if (response.data.response === "error 23000") {
                        customDialog.openInformationDialog(MESSAGE.DEL_ERROR).then();
                    }
                }, _errorCallback);
        }

        function getHeader() {
            return ["Завдання", "Рівень", "Тип"];
        }

        function getLevels() {
            var levels = [];
            for (var i = 1; i <= 7; i++){
                levels.push(i.toString());
            }
            
            return levels;
        }
        
        function getTypes() {
            
            return [TYPES_OF_QUESTION.SIMPLE, TYPES_OF_QUESTION.MULTI];
        }
    }
})();