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
     * @name dispensing-prescription-form.controller:prescriptionFormController
     *
     * @description
     * Exposes method for creating/updating prescription to the modal view.
     */
    angular
        .module('dispensing-prescription-form')
        .controller('prescriptionFormController', controller);

    controller.$inject = ['$filter', '$state', 'pointOfDeliveryService', '$scope', 'notificationService', 'dispensingService', 'dispensingPrescriptionDetailsModalService'];

    function controller($filter, $state, pointOfDeliveryService, $scope, notificationService, dispensingService, dispensingPrescriptionDetailsModalService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.prescriptions = []; 
        vm.addPrescription = addPrescription;
        vm.removePrescription= removePrescription;

        /**
         * @ngdoc method
         * @methodOf dispensing-prescription-form.controller:prescriptionFormController
         * @name $onInit
         *
         * @description
         * Initialization method of the prescriptionFormModalController.
         */
        function onInit() {

            console.log("...In init...")
        }

        /**
         * @ngdoc method
         * @methodOf dispensing-prescription-form.controller:prescriptionFormController
         * @name addContact
         *
         * @description
         * Add another line item for a Contact
         *
         */
        function addPrescription() {
            console.log("Add line item...");
            vm.prescriptions.push({
                //'phone': '',
                //'email': ''
            });  
        }

        // removing prescription from table
        function removePrescription(index) {
            console.log("Remove...");
            console.log(index);
            vm.prescriptions.splice(index, 1);
        }

        vm.addDiscrepancyOnModal = function(shipmentType) {
            dispensingService.show(shipmentType).then(function() {
                $stateParams.noReload = true;
                draft.$modified = true;
                vm.cacheDraft();
                //Only reload current state and avoid reloading parent state
                $state.go($state.current.name, $stateParams, {
                    reload: $state.current.name
                });
            }); 
        }
    }
})();
