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
     * @name dhis2-configuration-list:ConfigurationListController
     *
     * @description
     * Controller for configuration list view screen.
     */
    angular
        .module('dhis2-configuration-list')
        .controller('ConfigurationListController', controller);

    controller.$inject = [
        '$state', '$stateParams', '$q', 'ConfigurationResource',
        'confirmService', 'loadingModalService', 'configurations', 'notificationService'
    ];

    function controller($state, $stateParams, $q, ConfigurationResource,
                        confirmService, loadingModalService, configurations, notificationService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.deleteConfiguration = deleteConfiguration;
        vm.refreshState = refreshState;

        /**
         * @ngdoc method
         * @propertyOf dhis2-configuration-list:ConfigurationListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ConfigurationListController.
         */
        function onInit() {
            vm.configurations = configurations;
        }

        function deleteConfiguration(configuration) {
            return confirmService
                .confirmDestroy('dhis2ConfigurationList.delete.confirm', 'dhis2ConfigurationList.delete')
                .then(function() {
                    loadingModalService.open();
                    return new ConfigurationResource()
                        .delete(configuration);
                })
                .then(function() {
                    refreshState($stateParams);
                })
                .then(function() {
                    notificationService.success('dhis2ConfigurationList.configurationDeletedSuccessfully');
                })
                .catch(function(error) {
                    return $q.reject(error);
                })
                .finally(function() {
                    loadingModalService.close();
                });
        }

        function refreshState(stateParams) {
            $state.go('openlmis.administration.dhis2.configurations', stateParams, {
                reload: true
            });
            notificationService.success('dhis2ConfigurationEdit.pageHasBeenRefreshed');
        }

    }
})();
