(function() {
    "use strict";

    angular.module("app.user")
        .service("entityService", entityService);

    entityService.$inject = ["$http", "BASE_URL","URL"];

    function entityService($http, BASE_URL, URL) {
            this.getEntitiesById = getEntitiesById;

        function getEntitiesById(entity, idsArray) {
            var input = {
                entity: entity,
                ids: idsArray
            };
            return $http.post(BASE_URL + URL.ENTITIES.ENTITY_MANAGER + URL.GET_ENTITY_VALUES, input)
                .then(function(res) {
                    if(res.status === 200) {
                        return res.data;
                    } else {
                        return [];
                    }
                })
        }
    }
})();
