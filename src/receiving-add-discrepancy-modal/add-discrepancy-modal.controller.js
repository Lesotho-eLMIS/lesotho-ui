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
     * @name receiving-add-discrepancy-modal.controller:receivingAddDiscrepancyModalController
     *
     * @description
     * Manages Add Discrepancy Modal.
     */
    angular
        .module('receiving-add-discrepancy-modal')
        .controller('receivingAddDiscrepancyModalController', controller);

    controller.$inject = [ 'modalDeferred', '$scope', 'rejectionReasons', 'itemTimestamp', 'stockAdjustmentCreationService'];

    function controller( modalDeferred, $scope, rejectionReasons, itemTimestamp, stockAdjustmentCreationService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.confirm = confirm;
        //vm.discrepancies = rejectionReasons;
        vm.discrepancyOptions = [];
        vm.discrepancies =[];
        vm.selectedDiscrepancy = undefined;
        vm.addDiscrepancy = addDiscrepancy;
        vm.removeDispency = removeDiscrepancy;
        
        

        // adding discrepancies to table
        function addDiscrepancy() {
            vm.discrepancies.push({
                'name': vm.selectedDiscrepancy,
                'quantity': '',
                'comments': ''
            });
            console.log(vm.discrepancies);
        };

        // removing discrepancies from table
        function removeDiscrepancy(index) {
            vm.discrepancies.splice(index, 1);
        }
        
        function onInit() {
            vm.selectedDiscrepancy = [];
           
           vm.rejectionReasons = rejectionReasons.content;
           vm.rejectionReasons.forEach(reason => {
               // Load only those of type POD/Point of Delivery
               if(reason.rejectionReasonCategory.code == "POD"){
                   vm.discrepancyOptions.push(reason.name);
               }
               
           });
        }

        //builds receiving payload
        function confirm (){  
        //     var recevingDiscrepancies = {};        
        //    // $scope.recevingDiscrepancies = {};
        //    // $scope.recevingDiscrepancies [itemTimestamp] =  vm.discrepancies;
        //     recevingDiscrepancies [itemTimestamp] =  vm.discrepancies;
        //     console.log( $scope.recevingDiscrepancies);
        //     stockAdjustmentCreationService.addReceivingDiscrepancies(recevingDiscrepancies);
         
            // var recevingDiscrepancy = {};
            // angular.forEach(vm.discrepancies, function(discrepancy){
            // // Use $filter to find the matching object in rejectionReasons
            //     var reasonDetails = $filter('filter')(vm.rejectionReasons, { name: discrepancy.name }, true);
            //     // If a match is found, build the rejection object
            //     if (reasonDetails.length > 0) { 
            //         recevingDiscrepancy = {
            //             rejectionReason: angular.copy(reasonDetails[0]), 
            //             quantityAffected: discrepancy.quantity, 
            //             timestamp: itemTimestamp, 
            //             remarks: discrepancy.comments
            //         }
            //         console.log(recevingDiscrepancy);
            //         stockAdjustmentCreationService.addReceivingDiscrepancies(recevingDiscrepancy);
            //         recevingDiscrepancy = {};
            //     }                
            // });
            // vm.discrepancies = [];

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





        }
    }
})();
