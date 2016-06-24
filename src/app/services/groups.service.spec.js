describe('Test-suit for groups.service', function() {
    var $httpBackend, groupsService, URL, BASE_URL, url;
    var i             = 0;
    var group_id      = 1;
    var faculty_id    = 1;
    var speciality_id = 1;

    beforeEach(function() {
        module('app');
        inject(function(_$httpBackend_, _groupsService_, _URL_, _BASE_URL_) {
            $httpBackend  = _$httpBackend_;
            groupsService = _groupsService_;
            URL           = _URL_;
            BASE_URL      = _BASE_URL_;
        });
        url = [
            BASE_URL + URL.ENTITIES.GROUP + URL.GET_ENTITIES,
            BASE_URL + URL.ENTITIES.GROUP + URL.GET_ENTITIES + group_id,
            BASE_URL + URL.ENTITIES.GROUP + URL.GET_GROUPS_BY_FACULTY + faculty_id,
            BASE_URL + URL.ENTITIES.GROUP + URL.GET_GROUPS_BY_SPECIALITY + speciality_id,
            BASE_URL + URL.ENTITIES.GROUP + URL.REMOVE_ENTITY + group_id
        ];
        $httpBackend.whenGET(url[i]).respond(200, '');
    });

    afterEach(function() {
        i++;
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('getGroups should make a call on a backend for groups', function() {
        $httpBackend.expectGET(BASE_URL + URL.ENTITIES.GROUP + URL.GET_ENTITIES);
        groupsService.getGroups();
        $httpBackend.flush();
    });
    it('getGroup should make a call on a backend for a group by its ID', function() {
        $httpBackend.expectGET(BASE_URL + URL.ENTITIES.GROUP + URL.GET_ENTITIES + group_id);
        groupsService.getGroup(group_id);
        $httpBackend.flush();
    });
    it('getGroupsByFaculty should make a call on a backend for groups representing specific faculty', function() {
        $httpBackend.expectGET(BASE_URL + URL.ENTITIES.GROUP + URL.GET_GROUPS_BY_FACULTY + faculty_id);
        groupsService.getGroupsByFaculty(faculty_id);
        $httpBackend.flush();
    });
    it('getGroupsBySpeciality should make a call on a backend for groups representing specific speciality', function() {
        $httpBackend.expectGET(BASE_URL + URL.ENTITIES.GROUP + URL.GET_GROUPS_BY_SPECIALITY + speciality_id);
        groupsService.getGroupsBySpeciality(speciality_id);
        $httpBackend.flush();
    });
    it('removeGroups should make a call on a backend for removing a group from database', function() {
        $httpBackend.expectGET(BASE_URL + URL.ENTITIES.GROUP + URL.REMOVE_ENTITY + group_id);
        groupsService.removeGroup(group_id);
        $httpBackend.flush();
    });

    describe('test saveGroup method', function() {
        var group = {
            group_name:     'TestGroup',
            speciality_id:  1,
            faculty_id:     1
        };

        it('saveGroup should make a call on a backend with a POST method and send a group object to save group', function() {
            group.group_id = undefined;
            $httpBackend.expectPOST(BASE_URL + URL.ENTITIES.GROUP + URL.ADD_ENTITY, group).respond(201, '');
            groupsService.saveGroup(group);
            $httpBackend.flush();
            i--;
        });

        it('saveGroup should make a call on a backend with a POST method and send a group object to edit group', function() {
            group.group_id = 1;
            $httpBackend.expectPOST(BASE_URL + URL.ENTITIES.GROUP + URL.EDIT_ENTITY + group.group_id, group).respond(201, '');
            groupsService.saveGroup(group);
            $httpBackend.flush();
            i--;
        });
    });

    it('headers should return an array of headers for table', function() {
        expect(groupsService.headers()).toEqual([
            "Назва",
            "Факультет",
            "Спеціальність"
        ]);
        i--;
    });
});