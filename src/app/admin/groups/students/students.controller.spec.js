'use strict';

describe ("Test Students Controller", function () {

    beforeEach(module("app.admin.groups"));
    beforeEach(module("app"));

    var controller;
    var customDialog;
    var $scope;
    var $q;
    var MESSAGE;
    var studentsServiceMock = {};
    var groupsServiceMock = {};
    var student = {
        "user_id": "90",
        "gradebook_id": "yudsdded",
        "student_surname": "Соло",
        "student_name": "Андрій",
        "student_fname": "Іванович",
        "group_id": "3",
        "plain_password": "jo4xif529",
        "photo": ""
    };

    studentsServiceMock.getHeadElements = function (){
        return ["Ім'я", "Прізвище", "По-батькові", "Номер залікової книги", "Група"];
    };

    beforeEach(function(){
        angular.module('test', ["app.admin.groups"]).value("studentsService", studentsServiceMock);
        angular.module('test', ["app.admin.groups"]).value('groupsService', groupsServiceMock);
    });

    beforeEach(inject(function ($controller, _MESSAGE_,  _customDialog_, _$q_, _$rootScope_) {
        customDialog = _customDialog_;
        MESSAGE = _MESSAGE_;
        $scope = _$rootScope_.$new();
        $q = _$q_;
        spyOn(customDialog, "openDeleteDialog").and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });
        spyOn(customDialog, "openInformationDialog").and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });
        controller = $controller("StudentsController", {$scope: $scope, studentsService: studentsServiceMock,
        groupsService: groupsServiceMock});
    }));

    studentsServiceMock.getStudentsByGroupId = function (){
        var deferred = $q.defer();
        var result = [{
            "user_id": "105",
            "gradebook_id": "yudsddssdded",
            "student_surname": "Соло",
            "student_name": "Андрій",
            "student_fname": "Олегович",
            "group_id": "11",
            "plain_password": "jo4xi529",
            "photo": ""
        }, {
            "user_id": "90",
            "gradebook_id": "yudsdded",
            "student_surname": "Соло",
            "student_name": "Андрій",
            "student_fname": "Іванович",
            "group_id": "3",
            "plain_password": "jo4xif529",
            "photo": ""
        }];

        deferred.resolve(result);
        return deferred.promise;
    };

    studentsServiceMock.removeStudent = function (student) {
        var deferred = $q.defer();
        deferred.resolve("Call");
        return deferred.promise;
    };

    groupsServiceMock.getGroups = function (){
        var deferred = $q.defer();
        var result = [{group_id: 11, group_name: "СП-11-1" }, {group_id: 3, group_name: "ПП-12-1"}];
        deferred.resolve(result);
        return deferred.promise;
    };

    beforeEach(function(){
        spyOn(studentsServiceMock, "removeStudent").and.callThrough();
    });

    it("max", function(){
        expect(controller.maxSize).toBe(3);
    });

    it("get head elements", function(){
        expect(controller.headElements).toEqual(["Ім'я", "Прізвище", "По-батькові", "Номер залікової книги", "Група"]);
    });

    beforeEach(function(){
        controller.studentRemover(student);
    });

    it("should test call methods related  to students remover", function(){
        $scope.$apply();
        expect(customDialog.openDeleteDialog).toHaveBeenCalled();
        expect(studentsServiceMock.removeStudent).toHaveBeenCalled();
        expect(customDialog.openInformationDialog).toHaveBeenCalled();
        expect(customDialog.openDeleteDialog).toHaveBeenCalledWith(student.student_name);
        expect(studentsServiceMock.removeStudent).toHaveBeenCalledWith(student);
        expect(customDialog.openInformationDialog).toHaveBeenCalledWith(MESSAGE.SAVE_SUCCSES, "Збережено");
    });

    it("it should get list of groups and convert it to name map", function(){
        $scope.$apply();
        var assosGroup = {11: "СП-11-1", 3: "ПП-12-1"};
        expect(controller.associativeGroups).toEqual(assosGroup);
    });
});