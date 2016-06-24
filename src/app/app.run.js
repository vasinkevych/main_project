(function () {
    "use strict";

    // angular.module("app")
    //     .run(appRun);
    //
    // appRun.$inject = ["$rootScope", "authService", "USER_ROLES", "$state"];
    //
    // function appRun($rootScope, authService, USER_ROLES, $state) {
    //     $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    //         if (toState.data && toState.data.authorizedRole) {
    //             authService.isAuthorized().then(function(loggedIn) {
    //                 if (loggedIn &&
    //                     (((toState.name.indexOf("admin") !== -1) && (localStorage.userRole === USER_ROLES.ADMIN)) ||
    //                     ((toState.name.indexOf("user") !== -1) && (localStorage.userRole === USER_ROLES.USER)))) {
    //                         $state.go(toState, toParams);
    //                 } else {
    //                     event.preventDefault();
    //                     $state.go("auth");
    //                 }
    //             });
    //         }
    //     });
    // }
})();