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

    angular
        .module('point-of-delivery-quality-checks')
        .controller('pointOfDeliveryQualityChecksController', pointOfDeliveryQualityChecksController)

    pointOfDeliveryQualityChecksController.$inject = ['$rootScope', '$scope', 'pointOfDeliveryService', '$state', 'rejectionReasons']; // inject any dependencies here

    function pointOfDeliveryQualityChecksController($rootScope , $scope, pointOfDeliveryService, $state, rejectionReasons) {

        var vm = this;
        vm.$onInit = onInit;
        // Controller logic here
        vm.addDispency = addDiscrepency;
        vm.discrepancies = undefined;
        vm.selectedDiscrepancy = undefined;
        vm.discrepancySelectionChanged = discrepancySelectionChanged;
        vm.submitDiscrepancy = submitDiscrepancy;
        vm.goToPOD = goToPOD;
        vm.discrepancyOptions = [];// ["Wrong Item", "Wrong Quantity", "Defective Item", "Missing Item"];
        vm.containersOptions = ["Cartons", "Containers"];
        vm.test = undefined;
        vm.isQualityChecked = false;

        //Click Dummy Button
        vm.clickDummy = function(){
            console.log("clicked")
        }
      
        function onInit() {
            vm.discrepancies = [];
            vm.isShipmentOkay = 'No';
            //Loading rejection Reasons  to be displayed as options
            vm.rejectionReasons = rejectionReasons.content;
            vm.rejectionReasons.forEach(reason => {
                // Load only those of type POD/Point of Delivery
                if(reason.rejectionReasonCategory.code == "POD"){
                    vm.discrepancyOptions.push(reason.name);
                }
                
            });

        }
        
        function goToPOD() {
            $rootScope.referenceNoPOD = vm.referenceNo; 
            $state.go('openlmis.pointOfDelivery.manage');            
        }

        function submitDiscrepancy() {
            // To Send vm.discrepancies to Backend
            //console.log(vm.discrepancies);
            //console.log(vm.referenceNo);
            
            // if (vm.referenceNo=) {
            //     // Adding success message when POD saved.
            //     notificationService.success('Successfully Received');
            // } else {
            //     notificationService.error('Failed to receive data');
            // };

            var discrepancyDetails =  {};
            vm.discrepancies.forEach((discrepancy, index) => {
                discrepancyDetails[index] = discrepancy;
            });
                                
            // Resulting array of objects
            console.log(discrepancyDetails);

            pointOfDeliveryService.submitQualityDiscrepancies(discrepancyDetails);
            vm.isQualityChecked = true;
        }

        // adding discrepancies to table
        function addDiscrepency() {
            vm.discrepancies.push({
                'name': vm.selectedDiscrepancy,
                'quantity': '',
                'comments': ''
            });

            
        }

        function discrepancySelectionChanged() {
            console.log(vm.selectedDiscrepancy);
        }
    }
})();
