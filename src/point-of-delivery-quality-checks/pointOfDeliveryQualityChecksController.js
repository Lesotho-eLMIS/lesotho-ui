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

    pointOfDeliveryQualityChecksController.$inject = ['$rootScope', '$scope', 'pointOfDeliveryService', '$state', 'notificationService']; // inject any dependencies here

    function pointOfDeliveryQualityChecksController($rootScope , $scope, pointOfDeliveryService, $state, notificationService) {

        var vm = this;
        vm.$onInit = onInit;
        // Controller logic here
        vm.addDispency = addDiscrepency;
        vm.removeDispency = removeDiscrepancy;
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
            
            if (vm.referenceNo) {

                // To Send vm.discrepancies to Backend
                var discrepancyDetails =  {};
                vm.discrepancies.forEach((discrepancy, index) => {
                    discrepancyDetails[index] = discrepancy;
                });            
                // Resulting array of objects
                console.log(discrepancyDetails);
                pointOfDeliveryService.submitQualityDiscrepancies(discrepancyDetails);
                vm.isQualityChecked = true;
                notificationService.success('Successfully submitted.');

                vm.referenceNo="";
                vm.discrepancies={};
                vm.selectedDiscrepancy="";
                //$scope.discrepancyForm.$setPristine();
                //$scope.discrepancyForm.$setUntouched();

            } else {
                 notificationService.error('Reference number required. Try again.');
            };
        }

        // adding discrepancies to table
        function addDiscrepency() {
            vm.discrepancies.push({
                'name': vm.selectedDiscrepancy,
                'quantity': '',
                'comments': ''
            });
        }

        // removing discrepancies from table
        function removeDiscrepancy(index) {
            vm.discrepancies.splice(index, 1);
        }

        function discrepancySelectionChanged() {
            console.log(vm.selectedDiscrepancy);
        }
    }
})();
