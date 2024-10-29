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
     * @name stock-adjustment.controller:StockAdjustmentController
     *
     * @description
     * Controller for making adjustment.
     */
    angular
        .module('stock-adjustment')
        .controller('StockAdjustmentController', controller);

    controller.$inject = ['facility', 'programs', 'adjustmentType', '$state', 'offlineService', 'localStorageService', 
        'ADJUSTMENT_TYPE','requisitionService', '$filter', 'permissionService', 'REQUISITION_RIGHTS'];

    function controller(facility, programs, adjustmentType, $state, offlineService, localStorageService,
                        ADJUSTMENT_TYPE, requisitionService, $filter, permissionService, REQUISITION_RIGHTS) {
        var vm = this;

        vm.getRequisitions = getRequisitions;
        vm.formatDate = formatDate;
        vm.getRequisitionLineItems =getRequisitionLineItems;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment.controller:StockAdjustmentController
         * @name facility
         * @type {Object}
         *
         * @description
         * Holds user's home facility.
         */
        vm.facility = facility;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment.controller:StockAdjustmentController
         * @name programs
         * @type {Array}
         *
         * @description
         * Holds available programs for home facility.
         */
        vm.programs = programs;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment.controller:StockAdjustmentController
         * @name offline
         * @type {boolean}
         *
         * @description
         * Holds information about internet connection
         */
        vm.offline = offlineService.isOffline;

        vm.goToPendingOfflineEventsPage = goToPendingOfflineEventsPage;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment.controller:StockAdjustmentController
         * @name requisitions
         * @type {Array}
         *
         * @description
         * Holds available requisitions
         */
        getRequisitions().then(response => {
            vm.requisitions = response.content;
        });

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment.controller:StockAdjustmentController
         * @name isReceive
         * @type {Boolean}
         *
         * @description
         * Is true if adjustment type is receive
         */
        vm.isReceive = (adjustmentType.prefix === "stockReceive");
        
        vm.key = function(secondaryKey) {
            return adjustmentType.prefix + '.' + secondaryKey;
        };

        vm.proceed = function(program) {
            $state.go('openlmis.stockmanagement.' + adjustmentType.state + '.creation', {
                        programId: program.id,
                        program: program,
                        facility: facility
                    });
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment.controller:StockAdjustmentController
         * @name receive
         * @param {Object} requisition object to against which to receive
         * 
         * @description
         * Builds the requisition object to pass onto the requisition creation and changes state
         */
        vm.receive = function(program){
            var requisitionItems = [];
            getRequisitionLineItems(program).then(result => {
                console.log(result);
                //Filter out skipped items and pass only ordered products
                var orderedItems = result.filter(item => !item.skipped);
                 orderedItems.forEach(item => {
                    requisitionItems.push({
                        orderableId : item.orderable.id,
                        approvedQuantity : item.approvedQuantity,
                        packsToShip : item.packsToShip
                    })                 
                 })
                $state.go('openlmis.stockmanagement.' + adjustmentType.state + '.creation', {
                    programId: program.program.id,
                    requisitionLineItems: requisitionItems,
                    facility: facility
                });
            });
        }

       /**
         * @ngdoc method
         * @methodOf stock-adjustment.controller:StockAdjustmentController
         * @name getRequisitionLineItems
         * @param {Object} requisition object whose line items to retrieve.
         *
         * @description
         * Builds the requisition object to pass onto the requisition creation and changes state
         */ 
        function getRequisitionLineItems(program) {
            if (permissionService.hasRoleWithRightAndFacility(REQUISITION_RIGHTS.REQUISITION_VIEW)) {
                return requisitionService.get(program.id)
                    .then(function (requisitionDetails) {
                        console.log("Get requisition line items: ", requisitionDetails);
                        return requisitionDetails.requisitionLineItems;
                    });
            }
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment.controller:StockAdjustmentController
         * @name formatDate
         *
         * @description
         * Changes the format of a date string
         */
        function formatDate(dateString) {

            const date = new Date(dateString);

            // Check if the date is valid
            if (isNaN(date.getTime())) {
                throw new Error("Invalid date format");
            }

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment.controller:StockAdjustmentController
         * @name getRequisitions
         *
         * @description
         * Retrieves all "Open" requisitions from the past 3 months
         */
        function getRequisitions() { // edit time to make it 6 weeks
            var startDate = new Date();
            var endDate = new Date().setMonth(startDate.getMonth() - 3);
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
            //Build params object for retrieving requisitions
            var params = {
                initiatedDateFrom: endDate,
                initiatedDateTo: startDate,
                requisitionStatus: 'RELEASED'
            };
            var offlineFlag = false;
            if (permissionService.hasRoleWithRightAndFacility(REQUISITION_RIGHTS.REQUISITION_VIEW)) {
                return requisitionService.search(offlineFlag, params)
                    .then(function (requisitionDetails) {
                        console.log("Get requisitions: ", requisitionDetails)
                        return requisitionDetails;
                    });
            }
        }

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment.controller:StockAdjustmentController
         * @name offlineStockEvents
         * @type {boolean}
         *
         * @description
         * Holds information whether there is at least one cached stock event
         * of a given adjustment type
         */
        vm.offlineStockEvents = function() {
            var prefix,
                sameAdjustmentTypeEvent = false,
                stockEventsOffline = localStorageService.get('stockEvents');

            if (stockEventsOffline) {
                var events = angular.fromJson(stockEventsOffline);
                angular.forEach(events, function(value) {
                    value.find(function(event) {
                        // all line items in a given stock event are of the same adjustment type
                        prefix = getAdjustmentTypePrefix(event.lineItems[0]);
                        return sameAdjustmentTypeEvent = prefix === adjustmentType.prefix;
                    });
                });
                return sameAdjustmentTypeEvent;
            }
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment.controller:StockAdjustmentController
         * @name goToPendingOfflineEventsPage
         *
         * @description
         * Takes the user to the pending offline events page.
         */
        function goToPendingOfflineEventsPage() {
            $state.go('openlmis.pendingOfflineEvents');
        }

        function getAdjustmentTypePrefix(lineItem) {
            if (lineItem.sourceId) {
                return ADJUSTMENT_TYPE.RECEIVE.prefix;
            } else if (lineItem.destinationId) {
                return ADJUSTMENT_TYPE.ISSUE.prefix;
            }
            return ADJUSTMENT_TYPE.ADJUSTMENT.prefix;
        }
    }
})();
