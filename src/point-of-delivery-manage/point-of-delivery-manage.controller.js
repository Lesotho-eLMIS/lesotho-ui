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
     * @name point-of-delivery-manage.controller:pointOfDeliveryManageController
     *
     * @description
     * Controller for point of delivery manage.
     */
    angular
        .module('point-of-delivery-manage')
        .controller('pointOfDeliveryManageController', pointOfDeliveryManageController);

    pointOfDeliveryManageController.$inject = [
        '$rootScope','$state', '$filter','$q', '$stateParams', 'facility','facilities','facilityService','offlineService', 'localStorageFactory', 'confirmService','pointOfDeliveryService', 
        '$scope', 'notificationService', 'dateUtils'];

    function pointOfDeliveryManageController($rootScope, $state, $filter,$q, $stateParams, facility,facilities,facilityService, offlineService, localStorageFactory,
                                         confirmService, pointOfDeliveryService, $scope, notificationService, dateUtils ) {


        var vm = this;

        vm.maxDate = new Date();
        vm.maxDate.setHours(23, 59, 59, 999);

        vm.supplyingFacilities = facilities;
        vm.$onInit = onInit;
        vm.facility = facility;
     //   vm.receivingFacility = undefined;
        
     
        vm.POD = {};

        vm.submitPOD = function () {

                // var sourceId = vm.supplyingFacility.id;
                // var destinationId = vm.receivingFacility.id;
                // var referenceNumber = vm.POD.referenceNo;
                // var packingDate = vm.proofOfDelivery.receivedDate;
                // var packedBy = vm.POD.packedBy;
                // var numberOfCartons = vm.POD.numberOfCartons;
                // var numberOfContainers = vm.POD.numberOfContainers;
                // var remarks = vm.POD.remarks;

              
                var payloadData = {
                    sourceId:vm.supplyingFacility.id,
                    destinationId:vm.receivingFacility.id,
                    referenceNumber:vm.POD.referenceNo,
                    packingDate:vm.proofOfDelivery.receivedDate,
                    packedBy:vm.POD.packedBy,
                    numberOfCartons:vm.POD.numberOfCartons,
                    rejectedCartons:vm.POD.numberOfRejectedCartons,
                    numberOfContainers:vm.POD.numberOfContainers,
                    rejectecContainers:vm.POD.numberOfRejectedContainers,
                    remarks:vm.POD.remarks
                };


            var podResponse = pointOfDeliveryService.submitPodManage(payloadData);
            if (podResponse) {
                // Adding success message when POD saved.
                notificationService.success('Successfully Received');
            } else {
                notificationService.error('Failed to receive data');
            };
               
            vm.POD = {};
            vm.proofOfDelivery = {};
            $scope.podManageForm.$setPristine();
            $scope.podManageForm.$setUntouched();

        };

        /**
         * @ngdoc method
         * @methodOf point-of-delivery-manage.controller:pointOfDeliveryManageController
         * @name validateCartons
         *
         * @description
         * Checks if the number of rejected cartons is greater than the total number of cartons received. If it is, 
         * it resets the number of rejected cartons to 0
         */

        vm.validateCartons = function(){
            
            if(vm.POD.numberOfRejectedCartons > vm.POD.numberOfCartons){
                vm.POD.numberOfRejectedCartons = 0;
            }            
        }

        /**
         * @ngdoc method
         * @methodOf point-of-delivery-manage.controller:pointOfDeliveryManageController
         * @name validateContainers
         *
         * @description
         * Checks if the number of rejected containers is greater than the total number of containers received. If it is, 
         * it resets the number of rejected containers to 0
         */

        vm.validateContainers = function(){

            console.log(vm.POD.numberOfRejectedContainers + " && " + vm.POD.numberOfContainers)

            if(vm.POD.numberOfRejectedContainers > vm.POD.numberOfContainers){
                vm.POD.numberOfRejectedContainers = 0;
            }           
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

        // vm.viewDiscrepancies() View discrepancies from quality checks
        
        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name facilities
         * @type {Array}
         *
         * @description
         * The list of all facilities available to the user.
         */
        vm.facilities = undefined;

        /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */

     
        vm.homeFacilities = [ facility ];

        function onInit() {

          // var stateParams = angular.copy($stateParams);
            
            vm.receivingFacility = facility.name;
            vm.supplyingFacilities = facilities;        
            vm.offline = $stateParams.offline === 'true' || offlineService.isOffline();
           
            vm.POD.referenceNo = $rootScope.referenceNoPOD; // Getting  Ref Number from Quality Checks
            $rootScope.referenceNoPOD = undefined; // Clear Var on Root Scope
            console.log($rootScope.referenceNoPOD);
            console.log("Getting  Ref Number from Quality Checks");
          
        }
         
        var sendToView = pointOfDeliveryService.getPODs(facility.id);

       // Handle the promise resolution
       sendToView.then(function(resolvedObject) {
        // Assign the resolved object to a scope variable
            $scope.dataObject = vm.addSupplyingFacility(resolvedObject);
            $scope.dataObject.then(function(resolvedObject) {             
                $scope.PODEvents  = resolvedObject;                        
            })
                .catch(function(error) {
                 // Handle errors
                     console.error('Error in controller:', error);
                });

        })
        .catch(function(error) {
         // Handle errors
             console.error('Error in controller:', error);
            });
                

        // /**
        //  * @ngdoc method
        //  * @methodOf requisition-search.controller:RequisitionViewController
        //  * @name isOfflineDisabled
        //  *
        //  * @description
        //  * Check if "Search offline" checkbox should be disabled. It will set the searchOffline
        //  * flag to true if app goes in the offline mode.
        //  *
        //  * @return {Boolean} true if offline is disabled, false otherwise
        //  */
        // function isOfflineDisabled() {
        //     if (offlineService.isOffline()) {
        //         vm.offline = true;
        //     }
        //     return offlineService.isOffline();
        // }

        // /**
        //  * @ngdoc method
        //  * @methodOf requisition-search.controller:RequisitionViewController
        //  * @name openRnr
        //  *
        //  * @description
        //  * Redirect to requisition page after clicking on grid row.
        //  *
        //  * @param {String} requisitionId Requisition UUID
        //  */
        // function openRnr(requisitionId) {
        //     $state.go('openlmis.requisitions.requisition.fullSupply', {
        //         rnr: requisitionId
        //     });
        // }

        // /**
        //  * @ngdoc method
        //  * @methodOf requisition-search.controller:RequisitionViewController
        //  * @name removeOfflineRequisition
        //  *
        //  * @description
        //  * Removes requisition from local storage.
        //  *
        //  * @param {Resource} requisition Requisition to remove
        //  */
        // function removeOfflineRequisition(requisition) {
        //     confirmService.confirmDestroy('requisitionSearch.removeOfflineRequisition.confirm').then(function() {
        //         offlineRequisitions.removeBy('id', requisition.id);
        //         requisition.$availableOffline = false;
        //     });
        // }

        // /**
        //  * @ngdoc method
        //  * @methodOf requisition-search.controller:RequisitionViewController
        //  * @name search
        //  *
        //  * @description
        //  * Searches requisitions by criteria selected in form.
        //  */
        // function search() {
        //     var stateParams = angular.copy($stateParams);

        //     stateParams.program = vm.selectedProgram ? vm.selectedProgram.id : null;
        //     stateParams.facility = vm.selectedFacility ? vm.selectedFacility.id : null;
        //     stateParams.initiatedDateFrom = vm.startDate ? $filter('isoDate')(vm.startDate) : null;
        //     stateParams.initiatedDateTo = vm.endDate ? $filter('isoDate')(vm.endDate) : null;
        //     stateParams.offline = vm.offline;
        //     stateParams.requisitionStatus = vm.selectedStatus;

        //     $state.go('openlmis.requisitions.search', stateParams, {
        //         reload: true
        //     });
        // }
    }
})();
