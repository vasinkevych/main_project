(function () {
    "use strict";

    angular.module("app")
        .config(configApp);

    configApp.$inject = ["$stateProvider", "$urlRouterProvider", "$httpProvider", "USER_ROLES"];

    function configApp($stateProvider, $urlRouterProvider, $httpProvider, USER_ROLES) {
        $httpProvider.interceptors.push('spinnerService');
        
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state("auth", {
                url: "/",
                templateUrl: "app/auth/auth.html",
                controller: "AuthController as auth"
            })
            .state("admin", {
                url: "/admin",
                templateUrl: "app/admin/home-admin.html",
                controller: "HomeAdminController as admin",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.admins", {
                url: "/admins",
                templateUrl: "app/admin/admins/admins.html",
                controller: "AdminsController as admins",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.faculties", {
                url: "/faculties",
                templateUrl: "app/admin/faculties/faculties.html",
                controller: "FacultiesController as faculties",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.groups", {
                url: "/groups",
                templateUrl: "app/admin/groups/groups.html",
                controller: "GroupsController as groups",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.students", {
                url: "/groups/{group_id:int}/students",
                templateUrl: "app/admin/groups/students/students.html",
                controller: "StudentsController as students",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.student", {
                url: "/groups/{group_id:int}/students/:content_type/{student_id:int}",   
                templateUrl: "app/admin/groups/students/addstudent.html",
                controller: "StudentController as student",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.addStudent", {
                url: "/groups/{group_id:int}/students/:content_type",
                templateUrl: "app/admin/groups/students/addstudent.html",
                controller: "StudentController as student",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.reports", {
                url: "/reports",
                templateUrl: "app/admin/reports/reports.html",
                controller: "ReportsController as reports",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.reportDetails", {
                url: "/reports/{session_id:int}/{student_id:int}/{test_id:int}",
                templateUrl: "app/admin/reports/report-details/report-details.html",
                controller: "ReportDetailsController as details",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.specialities", {
                url: "/specialities",
                templateUrl: "app/admin/specialities/specialities.html",
                controller: "SpecialitiesController as specialities",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.groupsByEntity", {
                url: "/{entity}/{entity_id:int}/groups",
                templateUrl: "app/admin/groups/groups.html",
                controller: "GroupsController as groups",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.subjects", {
                url: "/subjects",
                templateUrl: "app/admin/subjects/subjects.html",
                controller: "SubjectsController as subjects",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.scheduleForEntity", {
                url: "/{entity}/{entity_id:int}/schedules",
                templateUrl: "app/admin/subjects/schedules/schedules.html",
                controller: "SchedulesController as schedules",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.tests", {
                url: "/subjects/{subject_id:int}/tests",
                templateUrl: "app/admin/subjects/tests/tests.html",
                controller: "TestsController as tests",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.questions", {
                url: "/subjects/{subject_id:int}/tests/{test_id:int}",
                templateUrl: "app/admin/subjects/tests/questions/questions.html",
                controller: "QuestionsController as questions",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.answer", {
                url: "/subjects/{subject_id:int}/tests/{test_id:int}/question/{question_id:int}/answer",
                templateUrl: "app/admin/subjects/tests/questions/answer/answer.html",
                controller: "AnswerController as answer",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("admin.testDetails", {
                url: "/subjects/{subject_id:int}/tests/{test_id:int}/details",
                templateUrl: "app/admin/subjects/tests/test-details/test-details.html",
                controller: "TestDetailsController as testDetails",
                data: {
                    authorizedRole: USER_ROLES.ADMIN
                }
            })
            .state("user", {
                url: "/user",
                templateUrl: "app/user/home-user.html",
                controller: "HomeUserController as user",
                data: {
                    authorizedRole: USER_ROLES.USER
                }
            })
            .state("user.subjects", {
                url: "/subjects",
                templateUrl: "app/user/subjects/user-subjects.html",
                controller: "UserSubjectsController as subjects",
                data: {
                    authorizedRole: USER_ROLES.USER
                }
            })
            .state("user.testPlayer", {
                url: "/subjects/test-player",
                templateUrl: "app/user/subjects/test-player/test-player.html",
                controller: "TestPlayerController as testPlayer",
                data: {
                    authorizedRole: USER_ROLES.USER
                }
            })
            .state("user.results", {
                url: "/results",
                templateUrl: "app/user/results/user-results.html",
                controller: "UserResultsController as results",
                data: {
                    authorizedRole: USER_ROLES.USER
                }
            })
            .state("user.finishTest", {
                url: "/subjects/test-player/test-result",
                templateUrl: "app/user/subjects/test-player/test-result/test-result.html",
                params: {userScore: null, maxScore: null},
                controller: "TestResultController as testResult",
                data: {
                    authorizedRole: USER_ROLES.USER
                }
            })
    }
})();

