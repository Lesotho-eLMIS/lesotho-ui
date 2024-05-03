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
     * @name dispensing-patients.controller:dispensingPatientsController
     *
     * @description
     * Controller for dispensing patients.
     */
    angular
        .module('dispensing-patients')
        .controller('dispensingPatientsController', dispensingPatientsController);

        dispensingPatientsController.$inject = [
        '$rootScope','$state','$stateParams', 'facility','facilities','facilityService','offlineService', 'dispensingService', 
        '$scope', 'notificationService', 'podAddDiscrepancyModalService'];

    function dispensingPatientsController($rootScope, $state,$stateParams, facility,facilities,facilityService, offlineService, 
        dispensingService, $scope, notificationService, podAddDiscrepancyModalService ) {

            

        var vm = this;
        vm.addPatientForm = undefined;

      //  vm.addDiscrepancyOnModal = addDiscrepancyOnModal;

        vm.supplyingFacilities = facilities;
        vm.$onInit = onInit;
        vm.facility = facility;
                                                
        vm.facilities = undefined;

        vm.homeFacilities = [ facility ];

     /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */        
         function onInit() {

        // var stateParams = angular.copy($stateParams);
          
            vm.receivingFacility = facility.name;
            vm.supplyingFacilities = facilities;        
            vm.offline = $stateParams.offline === 'true' || offlineService.isOffline();     
        }

        vm.addPatientForm = function(){
            console.log("Go...");
            //$state.go('openlmis.stockmanagement.prepack');
            //$state.go('openlmis.dispensing.patientsform');
            $state.go('openlmis.dispensing.patients.form');
        }


        vm.addDiscrepancyOnModal = function(shipmentType) {
            console.log("SHOW MODAL")
            pointOfDeliveryService.show(shipmentType).then(function() {
                $stateParams.noReload = true;
                draft.$modified = true;
                vm.cacheDraft();
                //Only reload current state and avoid reloading parent state
                $state.go($state.current.name, $stateParams, {
                    reload: $state.current.name
                });
            }); 
        }

        vm.getSupplyingFacilityName = async function(supplyingFacilityId) {
            try {
               
                var facilityObject = await facilityService.get(supplyingFacilityId);
                
                // Return Facility Name
                //console.log(facilityObject.name);
                return facilityObject.name;
            } catch (error) {
                // Handle any errors that may occur during the query
                console.error("Error:", error);
                return ""; // Or handle the error appropriately
            }
        };
     
        vm.addSupplyingFacility = async function(eventPODs) {
            try {
                // Create an array of Promises
                const promises = Object.keys(eventPODs).map(async key => {
                    const singlePODEvent = eventPODs[key];
        
                    // Check whether SourceId has a value before calling
                    if (singlePODEvent.sourceId) {
                        try {
                            const resolvedObject = await vm.getSupplyingFacilityName(singlePODEvent.sourceId);
                            singlePODEvent.sourceName = resolvedObject;
                        } catch (error) {
                            // Handle errors
                            console.error('Error in controller:', error);
                        }
                    }
        
                    return singlePODEvent;
                });
        
                // Await all Promises to resolve
                const eventPODsWithSupplierNames = await Promise.all(promises);
        
                return eventPODsWithSupplierNames.reduce((acc, curr, index) => {
                    acc[index] = curr;
                    return acc;
                }, {});
            } catch (error) {
                // Handle any errors that may occur during processing
                console.error('Error:', error);
                return {};
            }
        };
    }
})();
