(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .factory("answersService", answersService);

    answersService.$inject = ["$http", "BASE_URL", "URL"];

    function answersService($http, BASE_URL, URL) {
        var service = {
            getAnswersByQuestion: getAnswersByQuestion,
            saveAnswer: saveAnswer,
            removeAnswer: removeAnswer,
            getHeader: getHeader,
            getTypeOfAnswer: getTypeOfAnswer,
            disableChoice: disableChoice
        };

        return service;

        function _successCallback(response) {

            return response.data;
        }

        function _errorCallback(response) {

            return response;
        }

        function _addAnswer(answer) {

            return $http.post(BASE_URL + URL.ENTITIES.ANSWER + URL.ADD_ENTITY, answer)
                .then(_successCallback, _errorCallback);
        }

        function _editAnswer(answer) {

            return $http.post(BASE_URL + URL.ENTITIES.ANSWER + URL.EDIT_ENTITY + answer.answer_id, answer)
                .then(_successCallback, _errorCallback);
        }

        function getAnswersByQuestion(questions_id) {

            return $http.get(BASE_URL + URL.ENTITIES.ANSWER + URL.GET_ANSWERS_BY_QUESTION + questions_id)
                .then(_successCallback, _errorCallback);
        }

        function saveAnswer(answer, id) {
            if (answer.question_id === undefined) {
                answer.question_id = id;
                if (answer.attachment === undefined) {
                    answer.attachment = "";
                }

                return _addAnswer(answer);
            } else {

                return _editAnswer(answer);
            }
        }

        function removeAnswer(id) {

            return $http.get(BASE_URL + URL.ENTITIES.ANSWER + URL.REMOVE_ENTITY + id)
                .then(_successCallback, _errorCallback);
        }

        function getHeader() {

            return ["Зображення", "Текст відповіді", "Правильність"];
        }
 
        function getTypeOfAnswer() {

            return [{name: "Невірно", value: "0"}, {name: "Вірно", value: "1"}];
        }

        function disableChoice(arrayOfData, typeOfQuestion) {
            var trueAnswerOnPage;
            if (Array.isArray(arrayOfData)) {
                trueAnswerOnPage = arrayOfData.some(function (obj) {

                    return parseInt(obj.true_answer);
                });

                return !(typeOfQuestion - 1) && trueAnswerOnPage;
            } else {

                return false;
            }
        }
    }
})();