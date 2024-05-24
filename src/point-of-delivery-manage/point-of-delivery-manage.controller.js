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
        '$rootScope','$state','$stateParams', 'facility','facilities','facilityService','offlineService', 'pointOfDeliveryService', 
        '$scope', 'notificationService', 'podAddDiscrepancyModalService', 'podEvents','confirmService', 'messageService'];

    function pointOfDeliveryManageController($rootScope, $state,$stateParams, facility,facilities,facilityService, offlineService, 
                                        pointOfDeliveryService, $scope, notificationService, podAddDiscrepancyModalService, podEvents,  confirmService, messageService ) {


        var vm = this;

        vm.maxDate = new Date();
        vm.maxDate.setHours(23, 59, 59, 999);
      //  vm.addDiscrepancyOnModal = addDiscrepancyOnModal;

        vm.supplyingFacilities = facilities;
        vm.$onInit = onInit;
        vm.facility = facility;
        vm.POD = {};
        vm.discrepancy = {};
        vm.tempPOD = undefined;
        vm.proofOfDelivery ={};
        vm.Cartons = "Cartons";
        vm.Containers = "Containers";                                        
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
            vm.POD.referenceNo = $rootScope.referenceNoPOD; // Getting  Ref Number from Quality Checks
            $rootScope.referenceNoPOD = undefined; // Clear Var on Root Scope 
            if($stateParams.podId){
                vm.tempPOD = filterShipmentById(podEvents, $stateParams.podId);
                console.log(vm.tempPOD.discrepancies);
                populatePODView(vm.tempPOD);
            }

        }
    
        function filterShipmentById(shipments, id) {
            if (shipments.hasOwnProperty(id)) {
                return shipments[id];
            } else {
                return null;
            }
        }

        vm.addDiscrepancyOnModal = function(shipmentType, currentDiscrepancies) {
            pointOfDeliveryService.show(shipmentType,currentDiscrepancies ).then(function() {
                $stateParams.noReload = true;
                draft.$modified = true;
                vm.cacheDraft();
                //Only reload current state and avoid reloading parent state
                $state.go($state.current.name, $stateParams, {
                    reload: $state.current.name
                });
            }); 
        }
        function populatePODView(podObject) {
            vm.POD.referenceNo = podObject.referenceNumber;
            vm.proofOfDelivery.receivedDate = podObject.packingDate;
            vm.POD.packedBy = podObject.packedBy;
            vm.discrepancy.cartonsQuantityOnWaybill = podObject.cartonsQuantityOnWaybill;
            vm.discrepancy.cartonsQuantityAccepted = podObject.cartonsQuantityAccepted;
            vm.discrepancy.cartonsQuantityRejected = podObject.cartonsQuantityRejected;
            vm.discrepancy.containersQuantityOnWayBill = podObject.containersQuantityOnWaybill;
            vm.discrepancy.containersQuantityAccepted = podObject.containersQuantityAccepted;
            vm.discrepancy.containersQuantityRejected = podObject.containersQuantityRejected;
            console.log( vm.discrepancy);
        }

        /**
         * @ngdoc method
         * @methodOf point-of-delivery-manage.controller:pointOfDeliveryManageController
         * @name submitPOD
         *
         * @description
         * Builds POD receive payload for sending to backend
         */
        vm.submitPOD = function () {

            //var descrepancies = podAddDiscrepancyModalService.getDiscrepancies(); 
                var discrepancyList = pointOfDeliveryService.getDiscrepancies();
                console.log("discrepancyList");
                console.log(discrepancyList);
                if (vm.POD.referenceNo) {
             
                var payloadData = {
                    sourceId:vm.supplyingFacility.id,
                    destinationId:vm.receivingFacility.id,
                    referenceNumber:vm.POD.referenceNo,
                    packingDate:vm.proofOfDelivery.receivedDate,
                    packedBy:vm.POD.packedBy,
                    cartonsQuantityOnWaybill: vm.discrepancy? vm.discrepancy.cartonsQuantityOnWaybill : null,
                    //Quantity Shipped = Quantity Accepted + Quantity Rejected for both cartons and containers
                    cartonsQuantityShipped: vm.discrepancy? (vm.discrepancy.cartonsQuantityRejected + vm.discrepancy.cartonsQuantityAccepted) : null,
                    cartonsQuantityAccepted: vm.discrepancy ? vm.discrepancy.cartonsQuantityAccepted : null,
                    cartonsQuantityRejected: vm.discrepancy ? vm.discrepancy.cartonsQuantityRejected : null,
                    containersQuantityOnWaybill: vm.discrepancy ? vm.discrepancy.containersQuantityOnWayBill : null,
                    containersQuantityShipped: vm.discrepancy ? (vm.discrepancy.containersQuantityAccepted + vm.discrepancy.containersQuantityRejected) : null,
                    containersQuantityAccepted: vm.discrepancy? vm.discrepancy.containersQuantityAccepted : null,
                    containersQuantityRejected: vm.discrepancy? vm.discrepancy.containersQuantityRejected : null,
                    discrepancies: discrepancyList
                }; 
                
                
                console.log("Pay load");
                console.log(payloadData);

                if (vm.tempPOD) {
                    // call the edit POD method here    
                    confirmService
                        .confirm("Are you sure you want to edit this point of delivery event?", 'Edit')
                        .then(function () {
                        pointOfDeliveryService.editPOD(vm.tempPOD.id,payloadData)
                        .then(function(response) {
                            // Success callback
                            vm.tempPOD = undefined;
                            vm.POD = {};
                            vm.discrepancy = [];
                            vm.proofOfDelivery = {};
                            pointOfDeliveryService.clearDiscrepancies();
                            $scope.podManageForm.$setPristine();
                            $scope.podManageForm.$setUntouched();
                            notificationService.success('point of delivery event Edited.');
                            $state.go('openlmis.pointOfDelivery.view');
                            }
                        )
                        .catch(function(error) {
                            // Error callback
                            notificationService.error('Failed to edit.');
                            console.error('Error occurred:', error);
                        
                        });
                        });
                }else{
                    //Saving New POD event
                    confirmService
                        .confirm("Are you sure you want to submit this point of delivery event?", 'Submit')
                        .then(function () {
                         pointOfDeliveryService.submitPodManage(payloadData)
                        .then(function(response) {
                            // Success callback
                            vm.POD = {};
                            vm.discrepancy = [];
                            vm.proofOfDelivery = {};
                            pointOfDeliveryService.clearDiscrepancies();
                            $scope.podManageForm.$setPristine();
                            $scope.podManageForm.$setUntouched();
                            notificationService.success('point of delivery event Submitted.');
                            $state.go('openlmis.pointOfDelivery.view');
                            }
                        )
                        .catch(function(error) {
                            // Error callback
                            notificationService.error('Failed to submit.');
                            console.error('Error occurred:', error);
                        
                        });
                        });

                }
            } else {
                notificationService.error('Reference number required. Try again.');
            };
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

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name facilities
         * @type {Array}
         *
         * @description
         * The list of all facilities available to the user.
         */

    }
})();
