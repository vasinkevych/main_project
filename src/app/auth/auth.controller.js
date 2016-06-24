(function() {
    "use strict";

    angular.module("app")
        .controller("AuthController", AuthController);

    AuthController.$inject = ["authService", "$state"];

    function AuthController(authService, $state) {
        var vm = this;
        vm.credentials = {};
        vm.authentication = authentication;
        vm.isCollapsed = true;
        vm.checkResponse = checkResponse;

        function authentication() {
            authService.login(vm.credentials).then(function (data) {
                vm.checkResponse(data)
            })
        }

        function checkResponse(data) {
            if (data.response === "ok" && data.roles[1] === "admin") { 
                $state.go("admin");
            } else if (data.response === "ok" && data.roles[1] === "student") {
                $state.go("user");
            } else {
                vm.isCollapsed = false;
            }
        }
    }
})();