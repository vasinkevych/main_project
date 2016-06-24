(function() {
    "use strict";

    angular.module("app.user")
        .controller("UserResultsController", UserResultsController);

    UserResultsController.$inject = ["userService"];

    function UserResultsController(userService) {
        var vm = this;
        vm.headElements = userService.getHeaderResults();
        activate();
        
        function activate() {
            getCurrentUser();
            getResults();
        }

        function getCurrentUser() {
            return userService.getCurrentUser().then(function(user) {
                vm.currentUser = user;
            })
        }
        
        function getResults() {
            return userService.getResults().then(function(data) {
                if (Array.isArray(data)) {
                    vm.resultsList = data;
                } else {
                    vm.resultsList = [];
                }
            });
        }
    }
})();