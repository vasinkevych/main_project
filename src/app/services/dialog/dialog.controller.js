(function () {
  "use strict";
 
    angular.module("custom.dialog").controller("dialogController", dialogController);

    dialogController.$inject = ["$uibModalInstance", "dialogData"];

    function dialogController($uibModalInstance, dialogData){
      var vm = this;     
      vm.data = dialogData;
      
      vm.return = function (button) {        
        if (button.dismiss) {
          $uibModalInstance.dismiss(button.value || button.label);
        }
        else {
          $uibModalInstance.close(button.value || button.label);
        }
      }; 
    }

})();
