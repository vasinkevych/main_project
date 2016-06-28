(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .service("RequestService", RequestService);

    RequestService.$inject = ["$http", "$q", "PAGINATION", "BASE_URL", "URL", "testsService"];

    function RequestService($http, $q, PAGINATION, BASE_URL, URL, testsService) {

        this.getEntities = getEntities;
        this.getAllEntities= getAllEntities;
        this.getOneEntity = getOneEntity;
        this.totalItems = totalItems;
        this.addEntity = addEntity;
        this.editEntity = editEntity;
        this.removeEntity = removeEntity;

        function _successCallback(response) {
            return response.data;
        }
        function _errorCallback(response) {
            return response;
        }

        function addEntity (entity, newElement){

            return $http.post(BASE_URL + entity + "/"+ URL.ADD_ENTITY, newElement)
                .then(_successCallback, _errorCallback);
        }

        function editEntity(entity, editElement, elementId){

            return $http.post(BASE_URL + entity + "/" + URL.EDIT_ENTITY  + elementId, editElement)
                .then(_successCallback, _errorCallback);
        }

        function getAllEntities(entity){
            return $http.get(BASE_URL + entity + URL.GET_ENTITIES)
                .then(_successCallback, _errorCallback);
        }

        function getEntities(params){
            return $http.get(BASE_URL + params.entity + "/" + URL.GET_ENTITY_RANGE + PAGINATION.ENTITIES_RANGE_ON_PAGE + "/" + params.currentRecordsRange)
                .then(_successCallback, _errorCallback);
        }

        function getOneEntity(entity, entityId) {
            return $http.get(BASE_URL + entity + URL.GET_ENTITIES + entityId)
                .then((function(result) {
                    return result.data[0];
                }), _errorCallback);
        }

        function totalItems(entity){
            return $http.get(BASE_URL + entity + URL.COUNT_ENTITY)
                .then(_successCallback, _errorCallback);
        }

        function removeEntity (entity, removeObjId) {

            return $http.get(BASE_URL + entity + "/" + URL.REMOVE_ENTITY + removeObjId)
                .then(_successCallback, _errorCallback);
        }
    }
})();