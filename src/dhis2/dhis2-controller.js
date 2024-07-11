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
     * @name dhis2.controller:Dhis2Controller
     *
     * @description
     * Exposes method for adding/removing user roles.
     */
    angular
        .module('dhis2')
        .controller('Dhis2Controller', controller);

    controller.$inject = ['$state'];

    function controller($state) {

        var vm = this;

        vm.$onInit = onInit;

        /**
         * @ngdoc method
         * @methodOf dhis2.controller:Dhis2Controller
         * @name $onInit
         *
         * @description
         * Initialization method of the Dhis2Controller.
         */

        function onInit() {
            vm.tabs = [{
                state: 'openlmis.administration.dhis2.executions',
                name: 'dhis2.executions'
            }, {
                state: 'openlmis.administration.dhis2.integrations',
                name: 'dhis2.integrations'
            }, {
                state: 'openlmis.administration.dhis2.configurations',
                name: 'dhis2.configurations'
            }];

            if ($state.is('openlmis.administration.dhis2')) {
                $state.go('openlmis.administration.dhis2.executions');
            }
        }

    }
})();
