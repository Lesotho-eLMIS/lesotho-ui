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

    controller.$inject = ['pointOfDeliveryService', 'rejectionReasons','$filter', 'shipmentType'];

    function controller( pointOfDeliveryService, rejectionReasons, $filter, shipmentType) {
        var vm = this;

        vm.$onInit = onInit;
        //vm.discrepancies = rejectionReasons;
        vm.discrepancyOptions = [];
        vm.discrepancies = []; //undefined;
        vm.selectedDiscrepancy = undefined;
        vm.selectedDiscrepancies = []; // To hold list of selected discrepancy names
        vm.addDiscrepancy = addDiscrepency;
        vm.removeDispency = removeDiscrepancy;
        vm.confirmDiscrepancyList = confirmDiscrepancyList;
       // vm.modalDiscrepancies = [];

        /**
         * @ngdoc method
         * @methodOf pod-add-discrepancy-modal.controller:podAddDiscrepancyModalController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */        
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
        
        function addDiscrepency() {
                vm.discrepancies.push({
                    'shipmentType': shipmentType,
                    'name': vm.selectedDiscrepancy,
                    'quantity': '',
                    'comments': ''
                });  
        }

        // removing discrepancies from table
        function removeDiscrepancy(index) {
            vm.discrepancies.splice(index, 1);
        }
        
        function confirmDiscrepancyList (){
            // var cartonRejections = []; 
            // var containerRejections = [];
            var rejections = [];
            console.log("vm.discrepancies");
            console.log(vm.discrepancies);

            console.log("Rejection Reasons");
            console.log(vm.rejectionReasonss);
            

            angular.forEach(vm.discrepancies, function(reason){
            // Use $filter to find the matching object in rejectionReasons
                var reasonDetails = $filter('filter')(vm.rejectionReasons, { name: reason.name }, true);
                if (reasonDetails.length > 0) {

                // If a match is found, add the quantity property to the rejection reason
                    rejections.rejectionReason= angular.copy(reasonDetails[0]); 
                    rejections.quantityAffected = reason.quantity; // Add the quantity property from vm.discrepancies
                    rejections.shipmentType = reason.shipmentType; // Add the quantity property from vm.discrepancies
                    rejections.remarks = reason.comments;
                    pointOfDeliveryService.addDiscrepancies(rejections);
                   
                    vm.discrepancies = [];
                    rejections =[];
                }
            });

        //     console.log("Rejectionss");
        //     console.log(reasonDetails);
        //   //  var discrepancyList = cartonRejections.concat(containerRejections);
        //     pointOfDeliveryService.addDiscrepancies(rejections);
          
        //     console.log("Confirming discrepancies");
        //     console.log(rejections); 
            
        };
                     
    }
})();
