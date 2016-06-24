"use sctict";

describe("FacultiesController", function(){
    beforeEach(module("app.admin"));
    var ctrl, service;

    beforeEach(module(function($provide) {
        service = {};
        $provide.value("FacultyService", service);
    }));

    //beforeEach(inject(function($controller) {
    //    ctrl = $controller("FacultiesController");
    //}));
    it("should define controller", function(){
      expect(ctrl).toBeTrue();
    })
});