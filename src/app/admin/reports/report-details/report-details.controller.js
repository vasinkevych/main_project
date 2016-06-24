(function() {
    "use strict";

    angular.module("app.admin")
        .controller("ReportDetailsController", ReportDetailsController);

    ReportDetailsController.$inject = ["$stateParams", "reportsService"];

    function ReportDetailsController($stateParams, reportsService) {
        var vm = this;
        vm.headElements = reportsService.getHeaderOfReportDetail();
        activate();
        
        function activate() {
            getResultsDetail();
        }
        
        function getResultsDetail() {
            reportsService.getResultsDetail($stateParams.session_id).then(function(data) {
                vm.detail = data;
            });
        }
    }
})();