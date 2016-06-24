(function() {
    "use strict";

    angular.module("app")
        .directive("appHeader", appHeader);

    appHeader.$inject = [];

    function appHeader() {
        var directive = {
            templateUrl: "app/directives/header/header.directive.html",
            replace: true,
            controller: HeaderController,
            controllerAs: "header"
        };

        return directive;
    }

    HeaderController.$inject = ["authService"];

    function HeaderController(authService) {
        var vm = this;
        vm.isNavCollapsed = true;
        vm.navCollapse = navCollapse;
        vm.logout = logout;
        activate();

        function logout() {
            // authService.logout().then(function (response) {});
         }

        function activate() {
            // authService.isLogged().then(function (response){
            //     vm.username = response.username;
            //     vm.role = response.roles[1];
            // })
        }

        function navCollapse() {
            vm.isNavCollapsed = !vm.isNavCollapsed;
        }
    }
})();