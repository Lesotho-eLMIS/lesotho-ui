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

    pointOfDeliveryQualityChecksController.$inject = ['$scope', 'pointOfDeliveryService']; // inject any dependencies here

    function pointOfDeliveryQualityChecksController($scope, pointOfDeliveryService) {

        var vm = this;
        vm.$onInit = onInit;
        // Controller logic here
        vm.addDispency = addDiscrepency;
        vm.discrepancies = undefined;
        vm.selectedDiscrepancy = undefined;
        vm.discrepancySelectionChanged = discrepancySelectionChanged;
        vm.submitDiscrepancy = submitDiscrepancy;
        vm.goToPOD = goToPOD;
        vm.discrepancyOptions = ["Wrong Item", "Wrong Quantity", "Defective Item", "Missing Item"];
        vm.test = undefined;
        

       // vm.discrepancies = undefined;

        function onInit() {

            vm.discrepancies = [];
            vm.isShipmentOkay = 'No';
            
          }
        
        function goToPOD() {
            
        }

       
        function submitDiscrepancy() {
            // To Send vm.discrepancies to Backend
            console.log(vm.discrepancies);

            var discrepancyDetails =  {};

            vm.discrepancies.forEach((discrepancy, index) => {

                discrepancyDetails[index] = discrepancy;
            });
                                
            // Resulting array of objects
            console.log(discrepancyDetails);

          pointOfDeliveryService.submitQualityDiscrepancies(discrepancyDetails);
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
