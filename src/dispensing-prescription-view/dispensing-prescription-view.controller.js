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
     * @name dispensing-prescription-view.controller:dispensingPrescriptionView
     *
     * @description
     * Exposes method for creating/updating prescription to the modal view.
     */
    angular
        .module('dispensing-prescription-view')
        .controller('dispensingPrescriptionView', controller);

    controller.$inject = ['facility', 'Lots', 'Orderables', 'Prescription'];

    function controller(facility, Lots, Orderables, Prescription) {

        var vm = this;

        vm.$onInit = onInit;
        vm.getPrescriptionLineItemDetails = getPrescriptionLineItemDetails;
        vm.prescription = undefined;
        vm.prescriptionLineItems = undefined;
        vm.dispensableProducts = undefined;
        vm.facility = undefined;
        vm.facilityProducts = undefined;
        vm.lots = undefined;
        vm.orderables = undefined;
        vm.orderableIds = [];
        vm.dispensedProducts = [];
        vm.prescribedProducts = [];

        /**
         * @ngdoc method
         * @methodOf dispensing-prescription-view.controller:dispensingPrescriptionView
         * @name $onInit
         *
         * @description
         * Initialization method of the dispensingPrescriptionView.
         */
        function onInit() {

            vm.prescription = Prescription;
            vm.facility = facility;
            vm.prescriptionLineItems = Prescription.lineItems;
            //vm.dispensableProducts = Products.content;
            vm.lots = Lots;
            vm.orderables = Orderables;
           getPrescriptionLineItemDetails(vm.prescriptionLineItems);
        }

        function getPrescriptionLineItemDetails() {
            vm.prescriptionLineItems.forEach(item => {
                item.dosePeriod = item.duration + " " + item.durationUnits;
        
                // Use find() and check for existence
                var getLot = vm.lots.find(lot => item.lotId === lot.id);
                item.orderableLotCode = getLot ? getLot.lotCode : null;
                var dispensed = vm.orderables.find(orderable => item.orderableDispensed === orderable.id );
                var prescribed = vm.orderables.find(orderable => item.orderablePrescribed === orderable.id );
                item.dispensedProduct = dispensed ? dispensed.fullProductName : null;
                item.prescribedProduct = prescribed ? prescribed.fullProductName : null;
            });
        }        
    }
})();
