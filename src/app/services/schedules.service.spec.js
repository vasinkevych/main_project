describe('Test-suit for schedules.service', function() {
    var $httpBackend, schedulesService, URL, BASE_URL, url;
    var i             = 0;
    var group_id      = 1;
    var subject_id    = 1;
    var schedule_id   = 1;

    beforeEach(function() {
        module('app');
        inject(function(_$httpBackend_, _schedulesService_, _URL_, _BASE_URL_) {
            $httpBackend     = _$httpBackend_;
            schedulesService = _schedulesService_;
            URL              = _URL_;
            BASE_URL         = _BASE_URL_;
        });
        var baseSchedules = BASE_URL + URL.ENTITIES.TIME_TABLE;
        url = [
            baseSchedules + URL.GET_SCHEDULE_FOR_GROUP + group_id,
            baseSchedules + URL.GET_SCHEDULE_FOR_SUBJECT + subject_id,
            baseSchedules + URL.REMOVE_ENTITY + schedule_id
        ];
        $httpBackend.whenGET(url[i]).respond(200, '');
    });

    afterEach(function() {
        i++;
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('getSchedulesForGroup should make a call on a backend for time table for a specific group', function() {
        $httpBackend.expectGET(BASE_URL + URL.ENTITIES.TIME_TABLE + URL.GET_SCHEDULE_FOR_GROUP + group_id);
        schedulesService.getSchedulesForGroup(group_id);
        $httpBackend.flush();
    });
    it('getSchedulesForSubject should make a call on a backend for time table for a specific subject', function() {
        $httpBackend.expectGET(BASE_URL + URL.ENTITIES.TIME_TABLE + URL.GET_SCHEDULE_FOR_SUBJECT + subject_id);
        schedulesService.getSchedulesForSubject(subject_id);
        $httpBackend.flush();
    });
    it('removeSchedule should make a call on a backend for removing a time table from database', function() {
        $httpBackend.expectGET(BASE_URL + URL.ENTITIES.TIME_TABLE + URL.REMOVE_ENTITY + schedule_id);
        schedulesService.removeSchedule(schedule_id);
        $httpBackend.flush();
    });

    describe('test saveSchedule method', function() {
        var schedule = {
            group_id:    1,
            subject_id:  1,
            event_date:  '1970-01-01'
        };

        it('saveSchedule should make a call on a backend with a POST method and send a timetable object', function() {
            schedule.timetable_id = undefined;
            $httpBackend.expectPOST(BASE_URL + URL.ENTITIES.TIME_TABLE + URL.ADD_ENTITY, schedule).respond(201, '');
            schedulesService.saveSchedule(schedule);
            $httpBackend.flush();
            i--;
        });

        it('saveSchedule should make a call on a backend with a POST method and send a timetable object to edit', function() {
            schedule.timetable_id = 1;
            $httpBackend.expectPOST(BASE_URL + URL.ENTITIES.TIME_TABLE + URL.EDIT_ENTITY + schedule.timetable_id, schedule).respond(201, '');
            schedulesService.saveSchedule(schedule);
            $httpBackend.flush();
            i--;
        });
    });
});