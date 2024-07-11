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
     * @name dhis2-configuration-add-edit-general:ConfigurationAddEditController
     *
     * @description
     * Controller for managing configuration view screen.
     */
    angular
        .module('dhis2-configuration-edit')
        .controller('ConfigurationAddEditController', controller);

    controller.$inject = ['$state', 'configuration', 'ConfigurationResource', 'notificationService'];

    function controller($state, configuration, ConfigurationResource, notificationService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToConfigurationList  = goToConfigurationList;
        vm.saveConfiguration = saveConfiguration;

        /**
         * @ngdoc method
         * @propertyOf dhis2-configuration-add-edit-general:ConfigurationAddEditController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ConfigurationAddEditController.
         */
        function onInit() {
            vm.configuration = configuration;
            vm.isBearer = isBearer;
            vm.isBasic = isBasic;
        }

        /**
         * @ngdoc property
         * @propertyOf dhis2-configuration-add-edit-general:ConfigurationAddEditController
         * @name authType
         * @type {Object}
         *
         * @description
         * Holds options for authType.
         */
        vm.authTypes = ['BASIC', 'BEARER'];

        /**
         * @ngdoc method
         * @methodOf dhis2-configuration-add-edit-general:ConfigurationAddEditController
         * @name goToConfigurationList
         *
         * @description
         * Redirects to configuration list screen.
         */
        function goToConfigurationList(reload) {
            $state.go('openlmis.administration.dhis2.configurations', {}, {
                reload: reload
            });
        }

        /**
         * @ngdoc method
         * @methodOf dhis2-configuration-add-edit-general:ConfigurationAddEditController
         * @name saveConfiguration
         *
         * @description
         * Updates the configuration and return to the configuration list on success.
         */
        function saveConfiguration() {
            if (vm.configuration.id) {
                return new ConfigurationResource()
                    .update(vm.configuration)
                    .then(function() {
                        goToConfigurationList(true);
                    })
                    .then(function() {
                        notificationService.success('dhis2ConfigurationEdit.configurationEditSuccessfully');
                    });
            }
            return new ConfigurationResource()
                .create(vm.configuration)
                .then(function() {
                    goToConfigurationList(true);
                })
                .then(function() {
                    notificationService.success('dhis2ConfigurationEdit.configurationAddSuccessfully');
                });
        }

        function isBearer(authType) {
            return authType === vm.authTypes[1];
        }

        function isBasic(authType) {
            return authType === vm.authTypes[0];
        }

    }
})();
