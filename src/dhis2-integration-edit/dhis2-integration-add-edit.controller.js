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
     * @name dhis2-integration-add-edit-general:IntegrationAddEditController
     *
     * @description
     * Controller for managing integration view screen.
     */
    angular
        .module('dhis2-integration-edit')
        .controller('IntegrationAddEditController', controller);

    controller.$inject = ['$state', 'IntegrationResource', 'integration',
        'programs', 'configurations', 'notificationService'];

    function controller($state, IntegrationResource, integration,
                        programs, configurations, notificationService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToIntegrationList  = goToIntegrationList;
        vm.saveIntegration = saveIntegration;

        /**
         * @ngdoc property
         * @propertyOf dhis2-integration-add-edit-general:IntegrationAddEditController
         * @name day
         * @type {Object}
         *
         * @description
         * Holds options for days.
         */
        vm.days = undefined;

        /**
         * @ngdoc property
         * @propertyOf dhis2-integration-add-edit-general:IntegrationAddEditController
         * @name programs
         * @type {Array}
         *

         * @description
         * List of all programs.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf dhis2-integration-add-edit-general:IntegrationAddEditController
         * @name configurations
         * @type {Array}
         *

         * @description
         * List of all configurations.
         */
        vm.configurations = undefined;

        /**
         * @ngdoc method
         * @propertyOf dhis2-integration-add-edit-general:IntegrationAddEditController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating IntegrationAddEditController.
         */
        function onInit() {
            vm.integration = integration;
            vm.programs = programs;
            vm.configurations = configurations;
        }

        /**
         * @ngdoc method
         * @methodOf dhis2-integration-add-edit-general:IntegrationAddEditController
         * @name goToIntegrationList
         *
         * @description
         * Redirects to integration list screen.
         */
        function goToIntegrationList(reload) {
            $state.go('openlmis.administration.dhis2.integrations', {}, {
                reload: reload
            });
        }

        /**
         * @ngdoc method
         * @methodOf dhis2-integration-add-edit-general:IntegrationAddEditController
         * @name saveIntegration
         *
         * @description
         * Updates the integration and return to the integration list on success.
         */
        function saveIntegration() {
            if (vm.integration.id) {
                return new IntegrationResource()
                    .update(vm.integration)
                    .then(function() {
                        goToIntegrationList(true);
                    })
                    .then(function() {
                        notificationService.success('dhis2IntegrationEdit.integrationEditSuccessfully');
                    });
            }
            return new IntegrationResource()
                .create(vm.integration)
                .then(function() {
                    goToIntegrationList(true);
                })
                .then(function() {
                    notificationService.success('dhis2IntegrationEdit.integrationAddSuccessfully');
                });
        }
    }
})();
