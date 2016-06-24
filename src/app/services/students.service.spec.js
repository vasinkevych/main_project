'use strict';

describe("Students service", function () {

    var studentsService, httpBackend, BASE_URL, URL, PAGINATION;

    beforeEach(module("app.admin.groups"));

    beforeEach(module("app"));

    beforeEach(inject(function (_studentsService_, $httpBackend, _BASE_URL_, _URL_, _PAGINATION_) {
        studentsService = _studentsService_;
        httpBackend = $httpBackend;
        BASE_URL = _BASE_URL_;
        URL = _URL_;
        PAGINATION = _PAGINATION_;
    }));

    beforeEach(function(){

        httpBackend.whenGET(BASE_URL + URL.ENTITIES.STUDENT + URL.GET_ENTITIES + 27).respond(
            [{   "user_id": "27",
                "gradebook_id": "КА-2789",
                "student_surname": "Охріменкоооооо",
                "student_name": "Дмитро",
                "student_fname": "Майкрософтович",
                "group_id": "5",
                "plain_password": "cert",
                "photo": ""
            }]
        );

        httpBackend.whenGET(BASE_URL + URL.ENTITIES.STUDENT + URL.GET_STUDENTS_BY_GROUP + 5 + "/" + PAGINATION.ENTITIES_RANGE_ON_PAGE + "/" + 0).respond(
            [{   "user_id": "28",
                "gradebook_id": "КА-2789",
                "student_surname": "Охріменко",
                "student_name": "Дмитро",
                "student_fname": "Майкрософтович",
                "group_id": "5",
                "plain_password": "cert",
                "photo": ""
            }]
        );

        httpBackend.whenPOST(BASE_URL + URL.ENTITIES.STUDENT + URL.ADD_ENTITY).respond(
            {"id":155,"response":"ok"}
        );

        httpBackend.whenPOST(BASE_URL + URL.ENTITIES.STUDENT + URL.EDIT_ENTITY + 155).respond(
            {"response":"ok"}
        );
    });

    it("should return head elements of table", function(){
        var headElements = ["Ім'я", "Прізвище", "По-батькові", "Номер залікової книги", "Група"];
        expect(studentsService.getHeadElements()).toEqual(headElements);
    });

    it("should get one student by id", function(){
        var studentInfo = {   "user_id": "27",
            "gradebook_id": "КА-2789",
            "student_surname": "Охріменкоооооо",
            "student_name": "Дмитро",
            "student_fname": "Майкрософтович",
            "group_id": "5",
            "plain_password": "cert",
            "photo": ""
        };
        studentsService.getStudentById().then(function(data) {
            expect(data).toEqual(studentInfo);
        })
    });

    it("should get list of students by group id", function(){
        var list =  [{   "user_id": "28",
            "gradebook_id": "КА-2789",
            "student_surname": "Охріменко",
            "student_name": "Дмитро",
            "student_fname": "Майкрософтович",
            "group_id": "5",
            "plain_password": "cert",
            "photo": ""
        }];
        studentsService.getStudentsByGroupId().then(function(data) {
            expect(data).toEqual(list);
        })
    });

    it("should add new student", function(){
        var addResponse = {"id":155,"response":"ok"};
        studentsService.addStudent().then(function(data){
            expect(data).toEqual(addResponse);
        })
    });

    it("should edit student`s info", function(){
        var editResponse = {"response":"ok"};
        studentsService.editStudent().then(function(data){
            expect(data).toEqual(editResponse);
        })
    });

});
