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
     * @name stock-prepack-creation.controller:StockPrepackCreationController
     *
     * @description
     * Controller for prepacking.
     */
    angular
        .module('stock-prepack-creation')
        .controller('StockPrepackCreationController', controller);

    controller.$inject = ['facility', 'program', 'adjustmentType', '$state', 'offlineService',
        'localStorageService', 'ADJUSTMENT_TYPE', 'orderableGroups', 'orderableGroupService', '$scope', '$stateParams'];

    function controller(facility, program, adjustmentType, $state, offlineService, localStorageService,
                        ADJUSTMENT_TYPE, orderableGroups, orderableGroupService, $scope, $stateParams) {
        var vm = this;

        vm.addProduct = addProduct;
        vm.initiateNewLotObject = initiateNewLotObject;
        vm.lotChanged = lotChanged;
        vm.validateLotCode = validateLotCode;
        vm.addedLineItems = $stateParams.addedLineItems || [];
        console.log('ADDED LINE ITEMS');
        console.log(vm.addedLineItems);

        vm.key = function (secondaryKey) {
            return adjustmentType.prefix + 'Creation.' + secondaryKey;
          };

        /**
         * @ngdoc property
         * @propertyOf stock-prepack-creation.controller:StockPrepackCreationController
         * @name facility
         * @type {Object}
         *
         * @description
         * Holds user's home facility.
         */
        vm.facility = facility;

        /**
         * @ngdoc property
         * @propertyOf stock-prepack-creation.controller:StockPrepackCreationController
         * @name programs
         * @type {Array}
         *
         * @description
         * Holds available programs for home facility.
         */
        vm.program = program;

         // //-------------------------------ADD PRODUCT-----------------
       
         vm.orderableGroups = orderableGroups;

        /**
     * @ngdoc method
     * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
     * @name orderableSelectionChanged
     *
     * @description
     * Reset form status and change content inside lots drop down list.
     */
    vm.orderableSelectionChanged = function () {
        //reset selected lot, so that lot field has no default value
        vm.selectedLot = null;
  
        initiateNewLotObject();
        vm.canAddNewLot = false;
  
        //same as above
        $scope.productForm.$setUntouched();
  
        //make form good as new, so errors won't persist
        $scope.productForm.$setPristine();
  
        vm.lots = orderableGroupService.lotsOf(
          vm.selectedOrderableGroup,
          vm.hasPermissionToAddNewLot
        );
        vm.selectedOrderableHasLots = vm.lots.length > 0;
      };

      function lotChanged() {
        vm.canAddNewLot =
          vm.selectedLot &&
          vm.selectedLot.lotCode ===
            messageService.get('orderableGroupService.addMissingLot');
        initiateNewLotObject();
      }

      function initiateNewLotObject() {
        vm.newLot = {
          active: true,
        };
      }
         function addProduct() {
            var selectedItem;
      
            if (vm.selectedOrderableGroup && vm.selectedOrderableGroup.length) {
              vm.newLot.tradeItemId =
                vm.selectedOrderableGroup[0].orderable.identifiers.tradeItem;
            }
      
            if (vm.newLot.lotCode) {
              var createdLot = angular.copy(vm.newLot);
              selectedItem = orderableGroupService.findByLotInOrderableGroup(
                vm.selectedOrderableGroup,
                createdLot,
                true
              );
              selectedItem.$isNewItem = true;
            } else {
              selectedItem = orderableGroupService.findByLotInOrderableGroup(
                vm.selectedOrderableGroup,
                vm.selectedLot
              );
            }
      
            vm.newLot.expirationDateInvalid = undefined;
            vm.newLot.lotCodeInvalid = undefined;
            validateExpirationDate();
            validateLotCode(vm.addedLineItems, selectedItem);
            validateLotCode(vm.allItems, selectedItem);
            var noErrors =
              !vm.newLot.expirationDateInvalid && !vm.newLot.lotCodeInvalid;
      
            if (noErrors) {
              
              var timestamp = new Date().getTime();
              selectedItem.timestamp = timestamp; // Add a time stamp to the selected line item
              vm.addedLineItems.unshift(
                _.extend(
                  {
                    $errors: {},
                    $previewSOH: selectedItem.stockOnHand
                  },
                  selectedItem
                  //copyDefaultValue()
                )
              );
              previousAdded = vm.addedLineItems[0];
              vm.search();
            }
          }

          function validateLotCode(listItems, selectedItem) {
            if (selectedItem && selectedItem.$isNewItem) {
              listItems.forEach(function (lineItem) {
                if (
                  lineItem.orderable &&
                  lineItem.lot &&
                  selectedItem.lot &&
                  lineItem.orderable.productCode ===
                    selectedItem.orderable.productCode &&
                  selectedItem.lot.lotCode === lineItem.lot.lotCode &&
                  (!lineItem.$isNewItem ||
                    (lineItem.$isNewItem &&
                      selectedItem.lot.expirationDate !==
                        lineItem.lot.expirationDate))
                ) {
                  vm.newLot.lotCodeInvalid = messageService.get(
                    'stockEditLotModal.lotCodeInvalid'
                  );
                }
              });
            }
          }

           /**
     * @ngdoc method
     * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
     * @name validateExpirationDate
     *
     * @description
     * Validate if expirationDate is a future date.
     */
    function validateExpirationDate() {
        var currentDate = moment(new Date()).format('YYYY-MM-DD');
  
        if (vm.newLot.expirationDate && vm.newLot.expirationDate < currentDate) {
          vm.newLot.expirationDateInvalid = messageService.get(
            'stockEditLotModal.expirationDateInvalid'
          );
        }
      }

         //----------------------------------------------------------------------------
 

        /**
         * @ngdoc property
         * @propertyOf stock-prepack-creation.controller:StockPrepackCreationController
         * @name offline
         * @type {boolean}
         *
         * @description
         * Holds information about internet connection
         */
        vm.offline = offlineService.isOffline;

        vm.goToPendingOfflineEventsPage = goToPendingOfflineEventsPage;

        vm.key = function(secondaryKey) {
            return adjustmentType.prefix + '.' + secondaryKey;
        };

        vm.proceed = function(program) {
            if(adjustmentType.prefix==="stockPrepack"){
                console.log("proceed to prepack");
                $state.go('openlmis.stockmanagement.prepack.creation', {
                    programId: program.id,
                    program: program,
                    facility: facility
                });
            }
            else{
                $state.go('openlmis.stockmanagement.' + adjustmentType.state + '.creation', {
                    programId: program.id,
                    program: program,
                    facility: facility
                });
            }
        };

   
        /**
         * @ngdoc property
         * @propertyOf stock-prepack-creation.controller:StockPrepackCreationController
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
         * @methodOf stock-prepack-creation.controller:StockPrepackCreationController
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
