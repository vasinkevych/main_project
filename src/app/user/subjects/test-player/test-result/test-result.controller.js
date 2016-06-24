(function() {
    "use strict";

    angular.module("app.user")
        .controller("TestResultController", TestResultController);

    TestResultController.$inject = ["$stateParams", "testPlayerService", "testsService"];

    function TestResultController($stateParams, testPlayerService, testsService) {
        var vm = this;
        vm.headers = testPlayerService.getHeaders();
        vm.maxScore = $stateParams.maxScore;
        vm.userScore = $stateParams.userScore;
    }
})();