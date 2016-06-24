(function() {
    "use strict";

    angular.module("app.admin")
        .factory("reportsService", reportsService);

    reportsService.$inject = ["$http", "$q", "BASE_URL", "URL", "groupsService", "studentsService", "testsService",
        "subjectsService", "schedulesService", "questionsService"];

    function reportsService($http, $q, BASE_URL, URL, groupsService, studentsService, testsService, subjectsService,
                            schedulesService) {
        var results = [];
        var testName = "";

        var service = {
            getSubjects: getSubjects,
            updateGroupsBySubject: updateGroupsBySubject,
            updateTestsBySubject: updateTestsBySubject,
            getReport: getReport,
            getResultsDetail: getResultsDetail,
            getHeaderOfReport: getHeaderOfReport,
            getHeaderOfReportDetail: getHeaderOfReportDetail,
            uniqueItemsArray: uniqueItemsArray
        };

        return service;

        // callbacks functions
        function _successCallback(data) {
            return data;
        }
        function _errorCallback(response) {
            return response;
        }

        // get subjects for selectpicker in form
        function getSubjects() {
            return subjectsService.getAllSubjects().then(_successCallback, _errorCallback);
        }

        // update selectpicker Tests in form by choosing subject
        function updateTestsBySubject(subject) {
            return testsService.getTestsBySubject(subject.subject_id).then(_successCallback, _errorCallback);
        }

        // update selectpicker Groups in form by choosing subject
        function updateGroupsBySubject(subject) {
            return _getTimesTableBySubject(subject.subject_id).then(function(data) {
                var uniqueIdGroups = uniqueItemsArray(data, "group_id");
                return _getGroupsBySubject(uniqueIdGroups);
            });
        }

        // get timeTable by subject
        function _getTimesTableBySubject(subject_id) {
            return schedulesService.getSchedulesForSubject(subject_id)
                .then(_successCallback, _errorCallback);
        }

        // get groups by subject
        function _getGroupsBySubject(arrayOfIdGroups) {
            return groupsService.getGroups().then(function(data) {
                var groups = data;
                var groupsBySubject = groups.filter(function(item) {
                    return arrayOfIdGroups.indexOf(item.group_id) > -1;
                });
                return groupsBySubject;
            });
        }

        // get array of unique property value of objects in array
        function uniqueItemsArray(arrayOfObjects, propertyOfObject) {
            var uniqueItemsList = [];
            angular.forEach(arrayOfObjects, function(object) {
                if(uniqueItemsList.indexOf(object[propertyOfObject]) === -1){
                    uniqueItemsList.push(object[propertyOfObject]);
                }
            });

            return uniqueItemsList;
        }

        // create report by group and test
        function getReport(group, test) {
            return _getStudentsByGroup(group.group_id).then(function(data) {
                var arrayStudents = data;
                return _getResultByStudents(arrayStudents, test.test_id).then(function(data) {
                    var report = _addToResultsStudentsName(data, arrayStudents);
                    results = report;
                    testName = test.test_name;
                    return report;
                });
            });
        }
        
        // get students by group
        function _getStudentsByGroup(group_id) {
            return studentsService.getStudentsByGroupId(group_id).then(_successCallback, _errorCallback);
        }

        // get result by student
        function _getResultByStudents(arrayStudents, test_id) {
            var deferred = $q.defer();
            var urlCallsResultsStudents = [];
            angular.forEach(arrayStudents, function (student) {
                urlCallsResultsStudents[student.user_id] =
                    $http.get(BASE_URL + URL.ENTITIES.RESULT + URL.GET_RESULTS_BY_STUDENT + student.user_id);
            });
            $q.all(urlCallsResultsStudents).then(function(response) {
                var filteredResults = [];
                angular.forEach(response, function(resultsOfStudent) {
                    var arrayResults = resultsOfStudent.data;
                    if (!arrayResults.hasOwnProperty("response")) {
                        var filteredArray = arrayResults.filter(function(item) {
                            if (item.test_id === test_id) {
                                return true;
                            }
                        });
                        if (filteredArray.length != 0) {
                            filteredResults = filteredResults.concat(filteredArray);
                        }
                    }
                });
                deferred.resolve(filteredResults);
            }, function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }

        // add to array of results for each object in array property student_surname, student_name,student_fname
        function _addToResultsStudentsName(arrayResults, arrayStudents) {
            var resultsWithStudentName = [];
            angular.forEach(arrayStudents, function(student) {
                var filteredArray = arrayResults.filter(function(result) {
                    if (result.student_id === student.user_id) {
                        result.student_surname = student.student_surname;
                        result.student_name = student.student_name;
                        result.student_fname = student.student_fname;
                        return true;
                    }
                });
                resultsWithStudentName = resultsWithStudentName.concat(filteredArray);
            });

            return resultsWithStudentName;
        }

        function getHeaderOfReport() {
            return ["Студент", "Рейтинг", "Дата", "Початок тесту", "Кінець тесту"];
        }


        // details result of report
        function getResultsDetail(session_id) {
            var resultDetail = _getObjectByPropertyValueFromArray(results, "session_id", session_id.toString());

            return _getQuestionsByTest(resultDetail.test_id).then(function(questions) {
                var trueAnswers = resultDetail.true_answers.split("/").map(Number);
                var questionsId = resultDetail.questions.split("/").map(Number);
                var selectedAnswers = resultDetail.answers.split("/").map(function(item) {
                    if (item === "") {
                        return item;
                    } else if (item.indexOf("*") !== -1) {
                        return item.split("*").map(Number);
                    } else {
                        return Number(item);
                    }
                });

                var i = 0;
                resultDetail.questionsList = [];
                resultDetail.test_name = testName;

                return _getAnswersById(selectedAnswers).then(function(response) {
                    var answersResponse = response.map(function(item) {
                        return item.data[0];
                    });
                    angular.forEach(questionsId, function(questionId) {
                        var question = _getObjectByPropertyValueFromArray(questions.data, "question_id", questionId.toString());
                        var trueAnswer = trueAnswers[i];
                        var answers = [];
                        if (selectedAnswers[i] !== "") {
                            if (angular.isArray(selectedAnswers[i])) {
                                angular.forEach(selectedAnswers[i], function(item) {
                                    var temp = _getObjectByPropertyValueFromArray(answersResponse, "answer_id", item.toString());
                                    answers.push(temp);
                                });
                            } else {
                                var temp = _getObjectByPropertyValueFromArray(answersResponse, "answer_id", selectedAnswers[i].toString());
                                answers.push(temp);
                            }
                        }
                        resultDetail.questionsList.push({question: question, trueAnswer: trueAnswer, answers: answers});
                        i++;
                    });
                    return resultDetail;
                });
            });
        }

        // get answers by Id
        function _getAnswersById(selectedAnswers) {
            var answersId = [];
            angular.forEach(selectedAnswers, function(ids) {
                if (angular.isArray(ids)) {
                    angular.forEach(ids, function(id) {
                        answersId.push(id);
                    });
                } else if (ids !== "") {
                    answersId.push(ids);
                }
            });

            var deferred = $q.defer();
            var urlCalls = [];
            angular.forEach(answersId, function (id) {
                urlCalls[id] = $http.get(BASE_URL + URL.ENTITIES.ANSWER + URL.GET_ENTITIES + id);
            });
            $q.all(urlCalls).then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        }
        
        // get object by property value from array
        function _getObjectByPropertyValueFromArray(arrayOfObjects, property, value) {
            var filteredResult = arrayOfObjects.filter(function(item) { return item[property] === value; });

            return filteredResult[0];
        }

        // get questions by Test
        function _getQuestionsByTest(test_id) {
            return $http.get(BASE_URL + URL.ENTITIES.QUESTION + URL.GET_RECORDS_RANGE_BY_TEST + test_id + "/100/0/")
                .then(_successCallback, _errorCallback);
        }

        function getHeaderOfReportDetail() {
            return ["Завдання", "Відповідь"];
        }
    }

})();