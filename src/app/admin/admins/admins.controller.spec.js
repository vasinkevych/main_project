"use strict";

describe('AdminsController', function () {

    beforeEach(angular.mock.module('app.admin'));

    var $controller;
    var $scope;

    describe('headElements', function () {
        beforeEach(angular.mock.inject(function(_$controller_){
            $controller = _$controller_;
            $scope = {};
        }));
        it('should return headElements', function () {
            var mockService = function adminService() {
                var service = {
                    getHeader: function() {
                        return [" ", "Логін", "E-mail", "Останній вхід", "Візитів"];
                    }
                    // getAdmins: getAdmins,
                    // addAdmin: addAdmin,
                    // editAdmin: editAdmin,
                    // removeAdmin: removeAdmin,
                    // getAllCountRecords: getAllCountRecords
                }; 
                return service;
            };
            var $mockUibModal = {
                open: {
                    resolve: {
                        admin: function() {
                            return $scope.admin;
                        },
                        kindOfSave: function() {
                            return $scope.kindOfSave;
                        }
                    }
                }
            };
            var mockCustomDialog = function customDialog() {
                return {}; 
            }
            var mockAuthService = function authService() {
                return {}; 
            }
            var mockMESSAGE = function MESSAGE() {
                return {}; 
            }
            var controller = $controller('AdminsController', {$scope: $scope, adminService: mockService, $uibModal: $mockUibModal, customDialog: mockCustomDialog, authService: mockAuthService, MESSAGE: mockMESSAGE});
            expect($scope.headElements).toEqual([" ", "Логін", "E-mail", "Останній вхід", "Візитів"]);
        });
    });
});