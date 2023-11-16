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
     * @name requisition-search.controller:RequisitionViewController
     *
     * @description
     * Controller for requisition view page.
     */
    angular
        .module('point-of-delivery-manage')
        .controller('pointOfDeliveryManageController', pointOfDeliveryManageController);

    pointOfDeliveryManageController.$inject = [
        '$state', '$filter','$q', '$stateParams', 'facility','facilities','offlineService', 'localStorageFactory', 'confirmService','pointOfDeliveryManageService', 
        '$scope'];

    function pointOfDeliveryManageController($state, $filter,$q, $stateParams, facility,facilities, offlineService, localStorageFactory,
                                         confirmService, pointOfDeliveryManageService, $scope ) {

        var vm = this;

        vm.supplyingFacilities = facilities;
        vm.$onInit = onInit;
        vm.facility = facility;
        vm.receivingFacility = undefined;
     
        vm.POD = {};
     
    
        vm.submitPOD = function () {

                var sourceId = vm.supplyingFacility.id;
                var destinationId = vm.receivingFacility.id;
                var referenceNumber = vm.POD.referenceNo;
                var packingDate = vm.proofOfDelivery.receivedDate;
                var packedBy = vm.POD.packedBy;
                var numberOfCartons = vm.POD.numberOfCartons;
                var numberOfContainers = vm.POD.numberOfContainers;
                var remarks = vm.POD.remarks;

              
                var payloadData = {
                    sourceId:sourceId,
                    destinationId:destinationId,
                    referenceNumber:referenceNumber,
                    packingDate:packingDate,
                    packedBy:packedBy,
                    numberOfCartons:numberOfCartons,
                    numberOfContainers:numberOfContainers,
                    remarks:remarks
                };

            pointOfDeliveryManageService.sendPayload(payloadData);
            console.log("submitted");
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
        vm.facilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name statuses
         * @type {Array}
         *
         * @description
         * Contains all available requisition statuses.
         */
        vm.statuses = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name searchOffline
         * @type {Boolean}
         *
         * @description
         * Flag defining whether online or offline search should done. If it is set to true
         * the local storage will be searched for requisitions.
         */
        vm.searchOffline = false;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name selectedFacility
         * @type {Object}
         *
         * @description
         * The facility selected by the user.
         */
        vm.selectedFacility = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name selectedProgram
         * @type {Object}
         *
         * @description
         * The program selected by the user.
         */
        vm.selectedProgram = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name selectedStatus
         * @type {String}
         *
         * @description
         * The requisition status selected by the user.
         */
        vm.selectedStatus = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name startDate
         * @type {Object}
         *
         * @description
         * The beginning of the period to search for requisitions.
         */
        vm.startDate = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name endDate
         * @type {Object}
         *
         * @description
         * The end of the period to search for requisitions.
         */
        vm.endDate = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name requisitions
         * @type {Array}
         *
         * @description
         * Holds all requisitions that will be displayed on screen.
         */
        vm.requisitions = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-search.controller:RequisitionViewController
         * @name offline
         * @type {Boolean}
         *
         * @description
         * Indicates if requisitions will be searched offline or online.
         */
        vm.offline = undefined;

        vm.options = {
            'requisitionSearch.dateInitiated': ['createdDate,desc']
        };

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

            vm.homeFacilities = [
                facility
              ];
            vm.receivingFacility = facility.name;
            vm.supplyingFacilities = facilities;
            vm.offline = $stateParams.offline === 'true' || offlineService.isOffline();
          
        }

        
        // Handle the promise resolution
        var sendToView = pointOfDeliveryManageService.getPODs();

        console.log("I broke it!!");
               
        sendToView.then(function(resolvedObject) {
        // Assign the resolved object to a scope variable
            $scope.dataObject = resolvedObject;
        })
        .catch(function(error) {
         // Handle errors
             console.error('Error in controller:', error);
            });
                

        /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name isOfflineDisabled
         *
         * @description
         * Check if "Search offline" checkbox should be disabled. It will set the searchOffline
         * flag to true if app goes in the offline mode.
         *
         * @return {Boolean} true if offline is disabled, false otherwise
         */
        function isOfflineDisabled() {
            if (offlineService.isOffline()) {
                vm.offline = true;
            }
            return offlineService.isOffline();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name openRnr
         *
         * @description
         * Redirect to requisition page after clicking on grid row.
         *
         * @param {String} requisitionId Requisition UUID
         */
        function openRnr(requisitionId) {
            $state.go('openlmis.requisitions.requisition.fullSupply', {
                rnr: requisitionId
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name removeOfflineRequisition
         *
         * @description
         * Removes requisition from local storage.
         *
         * @param {Resource} requisition Requisition to remove
         */
        function removeOfflineRequisition(requisition) {
            confirmService.confirmDestroy('requisitionSearch.removeOfflineRequisition.confirm').then(function() {
                offlineRequisitions.removeBy('id', requisition.id);
                requisition.$availableOffline = false;
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name search
         *
         * @description
         * Searches requisitions by criteria selected in form.
         */
        function search() {
            var stateParams = angular.copy($stateParams);

            stateParams.program = vm.selectedProgram ? vm.selectedProgram.id : null;
            stateParams.facility = vm.selectedFacility ? vm.selectedFacility.id : null;
            stateParams.initiatedDateFrom = vm.startDate ? $filter('isoDate')(vm.startDate) : null;
            stateParams.initiatedDateTo = vm.endDate ? $filter('isoDate')(vm.endDate) : null;
            stateParams.offline = vm.offline;
            stateParams.requisitionStatus = vm.selectedStatus;

            $state.go('openlmis.requisitions.search', stateParams, {
                reload: true
            });
        }
    }
})();
