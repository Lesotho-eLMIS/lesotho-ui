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
     * @ngdoc service
     * @name complaint-form-modal.complaintFormModalService
     *
     * @description
     * This service will pop up a modal window for user to add discrepancies.
     */
    angular
        .module('complaint-form-modal')
        .service('complaintFormModalService', service);

    service.$inject = ['openlmisModalService'];

    function service(openlmisModalService) {
        this.show = show;

        /**
         * @ngdoc method
         * @methodOf pod-add-discrepancy-modal.podAddDiscrepancyModalService
         * @name show
         *
         * @description
         * Shows modal that allows users to choose products.
         *
         * @param  {Array}   availableItems orderable + lot items that can be selected
         * @param  {Array}   selectedItems  orderable + lot items that were added already
         * @return {Promise}                resolved with selected products.
         */

        var modalDialog = null;

        function show(itemTimestamp,program,facility,orderableGroups,hasPermissionToAddNewLot) {
            modalDialog = openlmisModalService.createDialog(
                {
                    controller: 'complaintFormModalController',
                    controllerAs: 'vm',
                    templateUrl: 'complaint-form-modal/complaint-form-modal.html',
                    show: true ,
                    resolve: {
                        rejectionReasons: function(rejectionReasonService) {
                                // Load rejection Reasons into the controller.
                                return rejectionReasonService.getAll();
                            
                        },
                        itemTimestamp: function() {
                            // Load rejection Reasons into the controller.
                            return itemTimestamp;
                        
                        },
                        program: function() {
                            console.log(program);
                            return program;
                        },
                        facility: function() {
                            console.log(facility);
                            return facility;
                        },
                        orderableGroups: function() {
                            console.log(orderableGroups);
                            return orderableGroups;
                        },
                        hasPermissionToAddNewLot: function() {
                            console.log(hasPermissionToAddNewLot);
                            return hasPermissionToAddNewLot;
                        },
                        user: function(currentUserService) {
                            return currentUserService.getUserInfo();
                        }
                    }   
                }
            ).promise.finally(function() {
                angular.element('.openlmis-popover').popover('destroy');
            });
            
            return modalDialog;
        }
    }

})();
