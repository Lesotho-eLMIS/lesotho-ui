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
     * @name pod-add-discrepancy-modal.controller:podAddDiscrepancyModalController
     *
     * @description
     * Manages Add Discrepancy Modal.
     */
    angular
        .module('pod-add-discrepancy-modal')
        .controller('podAddDiscrepancyModalController', controller);

    controller.$inject = [ 'modalDeferred', '$scope', 'rejectionReasons'];

    function controller( modalDeferred, $scope, rejectionReasons) {
        var vm = this;

        vm.$onInit = onInit;
        //vm.discrepancies = rejectionReasons;
        vm.discrepancyOptions = [];
        vm.discrepancies =[];
        vm.selectedDiscrepancy = undefined;
        vm.addDispency = addDiscrepency;
        vm.removeDispency = removeDiscrepancy;

        // adding discrepancies to table
        function addDiscrepency() {
            vm.discrepancies.push({
                'name': vm.selectedDiscrepancy,
                'quantity': '',
                'comments': ''
            });
        };

        // removing discrepancies from table
        function removeDiscrepancy(index) {
            vm.discrepancies.splice(index, 1);
        }
        
        function onInit() {
            vm.selectedDiscrepancy = [];
           console.log(rejectionReasons);

           vm.rejectionReasons = rejectionReasons.content;
           vm.rejectionReasons.forEach(reason => {
               // Load only those of type POD/Point of Delivery
               if(reason.rejectionReasonCategory.code == "POD"){
                   vm.discrepancyOptions.push(reason.name);
               }
               
           });
           /* modalDeferred.promise.catch(function() {
                vm.addedItems.forEach(function(item) {
                    item.quantity = undefined;
                    item.quantityInvalid = undefined;
                });
            }); */
        }
    }
})();
