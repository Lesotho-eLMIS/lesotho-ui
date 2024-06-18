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
     * @name stock-adjustment-creation.controller:AdjustmentQuantityUnitToggleController
     *
     * @description
     * Responsible for managing quantity unit element.
     */
    angular
        .module('openlmis-notification')
        .controller('notificationController', notificationController);

        notificationController.$inject = [
        'homeService','localStorageService'
    ];

    function notificationController(homeService, localStorageService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.getMessage = getMessage;
        vm.onChange = onChange;


        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:QuantityUnitToggleController
         * @name onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {

           console.log(isRead);
        }


        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:QuantityUnitToggleController
         * @name onChange
         *
         * @description
         * Handles change in toggle.
         */
        function onChange() {
            localStorageService.add(QUANTITY_UNIT_KEY, vm.quantityUnit);
        }

    }
})();