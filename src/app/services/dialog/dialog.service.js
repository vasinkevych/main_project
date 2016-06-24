(function () {
    "use strict";

    angular.module("custom.dialog").factory("customDialog", customDialogService);

    customDialogService.$inject = ["$uibModal", "MESSAGE"];

    function customDialogService($uibModal, MESSAGE){

        var defaultIconStyles = {
            info: ["fa fa-info-circle", "text-info"],
            warning: ["fa fa-exclamation", "text-warning"],
            danger: ["fa fa-exclamation-triangle", "text-danger"]
        };

        function openConfirmationDialog(messageBody, title) {

            return openDialog({
                title: title || "Підтвердження",
                iconType: "warning",
                body: messageBody || MESSAGE.EDIT_CONFIRM,
                buttons: [
                    {label: "Так", type:"success", value: "yes"},
                    {label: "Ні", value: "no", dismiss: true}
                ]
            }, {size: "sm"});
        }
       
        function openInformationDialog(messageBody, title) {

            return openDialog({
                title: title || "Інформаційне повідомлення",
                iconType: "info",
                body: messageBody,
                buttons: [
                    {label: "OK", type: "info"}
                ]
            }, {size: "sm"});
        }

        function openDeleteDialog() {

            return openDialog({
                iconType: "danger",
                title: "Видалення",
                body: MESSAGE.DEL_CONFIRM,
                buttons: [
                    {label: "Так", type: "danger"},
                    {label: "Ні", type: "info", dismiss: true}
                ]
            }, {size: "sm"});
        }

        function openChooseTestDialog (subject_name, availableTest) {
            return openDialog({
                title: "Бажаєте розпочати тест?",
                body: subject_name,
                availableTest: availableTest,
                buttons: [
                    {label: "Так", type:"success", value: "yessss"},
                    {label: "Ні", value: "no", dismiss: true}
                ]
            }, {size: "sm"});
        }

        function openDialog(data, customOptions) {

            if (data.iconType) {
                data.iconStyles = defaultIconStyles[data.iconType];
            }
            if (!customOptions) {
                customOptions = {};
            }

            var options = {};

            var defaultOptions = {
                templateUrl: "app/services/dialog/dialog.html",
                controller: "dialogController as dialogCtrl",
                resolve: {}
            };

            angular.extend(options, defaultOptions, customOptions);
            angular.extend(options.resolve, {
                dialogData: function () {
                    return data;
                }
            });

            return $uibModal.open(options).result;
        }

        return {
            openDeleteDialog: openDeleteDialog,
            openDialog: openDialog,
            openConfirmationDialog: openConfirmationDialog,
            openInformationDialog: openInformationDialog,
            openChooseTestDialog: openChooseTestDialog
        };
    }
})();
