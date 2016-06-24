(function() {
    "use strict";

    angular.module("app.admin")
        .controller("HomeAdminController", HomeAdminController);

    HomeAdminController.$inject = ["adminService"];

    function HomeAdminController(adminService) {
        var vm = this;
        vm.statistics = [];
        activate();

        function activate() {
            return adminService.getAllCountRecords().then(function(response) {
                vm.statistics = response;
                return vm.statistics;
            });
        }
    }
})();