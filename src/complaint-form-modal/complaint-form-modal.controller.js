/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name complaint-form-modal.controller:complaintFormModalController
     *
     * @description
     * Manages Add Discrepancy Modal.
     */
    angular
        .module('complaint-form-modal')
        .controller('complaintFormModalController', controller);

    controller.$inject = [ 'modalDeferred', '$scope', 'rejectionReasons', 'itemTimestamp', 'stockAdjustmentCreationService', 'notificationService', 
        'orderableGroups', 'program', 'facility', 'programService', 'orderableGroupService', 'hasPermissionToAddNewLot', 'messageService'];

    function controller( modalDeferred, $scope, rejectionReasons, itemTimestamp, stockAdjustmentCreationService, 
                        notificationService, orderableGroups, program, faciity, programService, orderableGroupService, hasPermissionToAddNewLot, messageService) {//
        var vm = this;

        vm.$onInit = onInit;
        vm.confirm = confirm;
        vm.lotChanged = lotChanged;
        vm.addProductToComplaintForm = addProductToComplaintForm;
        vm.removeProductLineItem = removeProductLineItem;
        vm.productsForComplaint = [];
        //vm.discrepancies = rejectionReasons;
        vm.discrepancyOptions = [];
        vm.discrepancies =[];
        vm.selectedDiscrepancy = undefined;
        //vm.addDiscrepancy = addDiscrepancy;
        //vm.removeDispency = removeDiscrepancy;

        $scope.showModal=false;
        

        // // adding productsForComplaint to table
        // function addDiscrepancy() {
        //     vm.productsForComplaint.push({
        //         'name': vm.vm.selectedOrderableGroup,
        //         'quantity': '',
        //         'comments': ''
        //     });
        //     console.log(vm.productsForComplaint);
        // };

        // // removing productsForComplaint from table
        // function removeDiscrepancy(index) {
        //     vm.productsForComplaint.splice(index, 1);
        // }
        
        function onInit() {
            vm.selectedDiscrepancy = [];
           
           vm.rejectionReasons = rejectionReasons.content;
           vm.rejectionReasons.forEach(reason => {
               // Load only those of type POD/Point of Delivery
               if(reason.rejectionReasonCategory.code == "POD"){
                   vm.discrepancyOptions.push(reason.name);
               }
               
           });


           vm.orderableGroups = orderableGroups;
           vm.hasLot = false;
           vm.orderableGroups.forEach(function (group) {
             vm.hasLot =
               vm.hasLot ||
               orderableGroupService.lotsOf(group, hasPermissionToAddNewLot).length >
                 0;
           });
           vm.showVVMStatusColumn = orderableGroupService.areOrderablesUseVvm(
             vm.orderableGroups
           );
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name orderableSelectionChanged
         *
         * @description
         * Reset form status and change content inside lots drop down list.
         */
        vm.orderableSelectionChanged = function () {
            //reset selected lot, so that lot field has no default value
            vm.selectedLot = null;
    
            initiateNewLotObject();
            vm.canAddNewLot = false;
    
            //same as above
            $scope.productForm.$setUntouched();
    
            //make form good as new, so errors won't persist
            $scope.productForm.$setPristine();
    
            vm.lots = orderableGroupService.lotsOf(
            vm.selectedOrderableGroup,
            vm.hasPermissionToAddNewLot
            );
            vm.selectedOrderableHasLots = vm.lots.length > 0;
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name lotChanged
         *
         * @description
         * Allows inputs to add missing lot to be displayed.
         */
        function lotChanged() {
            vm.canAddNewLot =
            vm.selectedLot &&
            vm.selectedLot.lotCode ===
                messageService.get('orderableGroupService.addMissingLot');
            initiateNewLotObject();
        }

        function initiateNewLotObject() {
            vm.newLot = {
              active: true,
            };
        }

        function addProductToComplaintForm() {
            console.log("Adding products...");
            console.log(vm.selectedOrderableGroup);
            console.log(vm.selectedOrderableGroup[0].orderable.fullProductName);
            console.log("Lot...");
            console.log(vm.selectedLot.expirationDate);
            // if(vm.selectedDiscrepancy.length!=0){
                vm.productsForComplaint.push({
                    'name': vm.selectedOrderableGroup[0].orderable.fullProductName,
                    'batch': vm.selectedLot.lotCode,
                    'expiary': vm.selectedLot.expirationDate
                    // 'quantityReturned': '',
                    // 'natureOfComplaint': ''
                });  
            // }
            // else{
            //     notificationService.error('Select a discrepancy before adding.');
            // }
        }

        // removing discrepancies from table
        function removeProductLineItem(index) {
            vm.productsForComplaint.splice(index, 1);
        }

        //builds receiving payload
        function confirm (){
            if(vm.discrepancies.length!=0){
                var receivingDiscrepancy = {};
                vm.discrepancies.forEach(function (discrepancy) {
                    // Use native array method find to find the matching object in rejectionReasons
                    var reasonDetails = vm.rejectionReasons.find(function (reason) {
                        return reason.name === discrepancy.name;
                    });
                    // If a match is found, build the rejection object
                    if (reasonDetails) {
                        receivingDiscrepancy = {
                            rejectionReason: angular.copy(reasonDetails),
                            quantityAffected: discrepancy.quantity,
                            timestamp: itemTimestamp,
                            remarks: discrepancy.comments
                        };
                        console.log(receivingDiscrepancy);
                        stockAdjustmentCreationService.addReceivingDiscrepancies(receivingDiscrepancy);
                        receivingDiscrepancy = {};
                    }
                });
                vm.discrepancies = [];
                modalDeferred.resolve();
            }
            else{
                notificationService.error('Add discrepancies before saving them.');
            }
        }
    }
})();
