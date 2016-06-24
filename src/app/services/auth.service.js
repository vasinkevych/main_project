(function() {
    "use strict";

    angular.module("app")
        .factory("authService", authService);

    authService.$inject = ["$http", "BASE_URL", "URL", "USER_ROLES"];

    function authService ($http, BASE_URL, URL, USER_ROLES) {
        
        var service = {
            login: login,
            isLogged: isLogged,
            logout: logout,
            isAuthorized: isAuthorized
        };

        return service;

        function login (credentials){

            return $http.post(BASE_URL + URL.LOGIN, credentials)
                .then(function(res) {
                    localStorage.userRole = res.data.roles[1];
                    return res.data;
                    }, function (res) {
                        return res;
                    });
        }

        function isLogged(){
            return $http.get(BASE_URL + URL.IS_LOGGED)
                .then(function(res) {
                        if (res.data.response === "logged") {
                            return res.data;
                        }
                    }, function (res) {
                        return res;
                    });
        }

        function logout(){
            return $http.get(BASE_URL + URL.LOGOUT)
                .then(function(res) {
                    localStorage.removeItem("userRole");
                        return res;
                    }, function (res) {
                        return res;
                    });
        }

        function isAuthorized() {
            return $http.get(BASE_URL + URL.IS_LOGGED)
                .then(function(res) {
                    if ((res.data.response === "logged") && 
                        ((res.data.roles[1] === USER_ROLES.ADMIN) || (res.data.roles[1] === USER_ROLES.USER))) {
                        return true;
                    } else {
                        return false;
                    }
                }, function (res) {
                    return false;
                });
        }
    }
})();