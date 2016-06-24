xdescribe("HeaderDirective Test", function () {

    beforeEach(angular.mock.module("app"));

    var scope, controller, httpBackend, authRequestHandler;

    beforeEach(angular.mock.inject(function ($rootScope, $compile, $injector) {
        scope = $rootScope.$new();
        var element = angular.element("<app-header></app-header>");
        template = $compile(element)(scope);
        scope.$digest();
        controller = element.controller;
        httpBackend = $injector.get('$httpBackend');
        authRequestHandler = $httpBackend.when("GET", "http://dtapi.local/login/isLogged")
            .respond({"roles":["login","admin"],"id":"1","username":"admin","response":"logged"});
    }));

    it("should navCollapse when isNavCollapsed() is called", inject (function ($httpBackend) {
        var url = "http://dtapi.local/login/isLogged";
        $httpBackend.expectGET(url).respond(200, "");
       
        controller.isNavCollapsed = false;
        controller.navCollapse();
        expect(controller.isNavCollapsed).toBeTruthy();
        controller.navCollapse();
        expect(controller.isNavCollapsed).toBeFalsy();
    }));
    
});
// describe("QuestionsController Test", function () {
//
//     beforeEach(angular.mock.module("app"));
//
//     var controller, scope;
//
//     beforeEach(angular.mock.inject(function ($controller, $rootScope) {
//         scope = $rootScope.$new();
//         controller = $controller("QuestionsController", {
//             $scope: scope
//         });
//     }));
//
//     it("should have controller defined and conrtoller"s property", function () {
//         expect(controller).toBeDefined();
//         expect(controller.saveQuestion).toBeDefined();
//         expect(controller.removeQuestion).toBeDefined();
//         expect(controller.saveFormCollapsed).toBe(true);
//     });
//
//     it("should have types of questions", function () {
//         expect(controller.types).toContain({NAME: "Простий вибір", VALUE: "1"}, {NAME: "Мульти-вибір", VALUE: "2"});
//     });
//
// });