(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .service("requestService", requestService);

    requestService.$inject = ["$http", "$q", "PAGINATION", "BASE_URL", "URL", "testsService"];

    function requestService($http, $q, PAGINATION, BASE_URL, URL, testsService) {
        this.getEntity = getEntity;
        this.getEntity = getEntity;
        this.getEntity = getEntity;


        function _successCallback(response) {
            return response.data;
        }
        function _errorCallback(response) {
            return response;
        }

        function getEntity(param){
            return $http.get(BASE_URL + URL.ENTITIES.SUBJECT + URL.GET_ENTITY_RANGE + PAGINATION.ENTITIES_RANGE_ON_PAGE + "/" + currentRecordsRange)
                .then(_successCallback, _errorCallback);
        }

    }
})();