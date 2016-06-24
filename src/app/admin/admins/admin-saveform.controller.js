(function() {
    "use strict";
 
    angular.module("app.admin")
        .controller("AdminSaveFormController", AdminSaveFormController);

    AdminSaveFormController.$inject = ["$uibModalInstance", "admin", "kindOfSave", "VALID"];

    function AdminSaveFormController($uibModalInstance, admin, kindOfSave, VALID) {
        var vm = this;
        vm.admin = (admin === null) ? {} : admin;
        vm.kindOfSave = kindOfSave;
        vm.maxUsernameLength = VALID.MAX_USERNAME_LENGTH;
        vm.maxPasswordLength = VALID.MAX_PASSWORD_LENGTH;
        vm.save = save;
        vm.cancel = cancel;         

        function save() {
            if (vm.newPassword) {
                vm.admin.password = vm.newPassword;
            }
            $uibModalInstance.close(vm.admin);
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();