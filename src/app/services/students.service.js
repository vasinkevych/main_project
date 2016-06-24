(function() {
    "use strict";

    angular.module("app.admin.groups")
        .factory("studentsService", studentsService);

    studentsService.$inject = ["$http", "$q", "BASE_URL", "URL", "PAGINATION"];

    function studentsService($http, $q, BASE_URL, URL, PAGINATION) {
        var studentsService = {
            getStudentsByGroupId: getStudentsByGroupId,
            getHeadElements: getHeadElements,
            addStudent: addStudent,
            removeStudent: removeStudent,
            getStudentById: getStudentById,
            editStudent: editStudent
        };

        return studentsService;

        function getStudentsByGroupId(group_id, currentRecordsRange) {
            var studentsData = $q.defer();
            $http.get(BASE_URL + URL.ENTITIES.STUDENT + URL.GET_STUDENTS_BY_GROUP + group_id + "/" + PAGINATION.ENTITIES_RANGE_ON_PAGE + "/" + currentRecordsRange).then(
                function (response) {
                    var result = angular.isArray(response.data) ? response.data : [];
                    studentsData.resolve(result);
                    },
                    function (response) {
                        studentsData.reject(response);
                    });

            return studentsData.promise;
        }

        //function that add new student in studentController!!! gettin all data that is needed for adding new student

        function addStudent(newStudent) {
            var addNewStudent = $q.defer();
            $http.post(BASE_URL + URL.ENTITIES.STUDENT + URL.ADD_ENTITY, newStudent).then(
                function (result) {
                    addNewStudent.resolve(result.data);
                },
                function (result) {
                    addNewStudent.rejcet(result);
                });

            return addNewStudent.promise;

        }

        //function that remove student from list of students with the same group_id

        function removeStudent(student) {
            var remover = $q.defer();
            $http.get(BASE_URL + URL.ENTITIES.STUDENT + URL.REMOVE_ENTITY + student.user_id).then(
                function (result) {
                    remover.resolve(result);
                },
                function (result) {
                    remover.reject(result);
                });

            return remover.promise;
        }


        //function that get one student by it`s specific user_id


        function getStudentById(student_id) {
            var oneStudent = $q.defer();
            $http.get(BASE_URL + URL.ENTITIES.STUDENT + URL.GET_ENTITIES + student_id).then(
                function (response) {
                    oneStudent.resolve(response.data[0]);
                },
                function (response) {
                    oneStudent.reject(response);
                });

            return oneStudent.promise;
        }

        //edit student function

        function editStudent(student, student_id){
            var studentEdit = $q.defer();

            $http.post(BASE_URL + URL.ENTITIES.STUDENT + URL.EDIT_ENTITY + student_id, student)
                .then(function(response){
                        studentEdit.resolve(response.config.data);
                    },
                    function (reason) {
                        studentEdit.reject(reason);
                    });

            return studentEdit.promise;
        }

        //function that get head elements for table that has all info about students of specific group...

        function getHeadElements () {
            return ["Ім'я", "Прізвище", "По-батькові", "Номер залікової книги", "Група"];
        }


    }
})();
