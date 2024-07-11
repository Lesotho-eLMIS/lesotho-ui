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
     * @name dhis2-integration-list:IntegrationListController
     *
     * @description
     * Controller for execution list view screen.
     */
    angular
        .module('dhis2-integration-list')
        .controller('IntegrationListController', controller);

    controller.$inject = [
        '$state', '$stateParams', '$q', 'IntegrationResource',
        'confirmService', 'loadingModalService', 'integrations',
        'programsMap', 'notificationService'
    ];

    function controller($state, $stateParams, $q, IntegrationResource,
                        confirmService, loadingModalService, integrations,
                        programsMap, notificationService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.deleteIntegration = deleteIntegration;
        vm.refreshState = refreshState;
        /**
         * @ngdoc method
         * @propertyOf dhis2-integration-list:IntegrationListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating IntegrationListController.
         */
        function onInit() {
            vm.integrations = integrations;
            vm.programs = programsMap;
        }

        function deleteIntegration(integration) {
            return confirmService
                .confirmDestroy('dhis2IntegrationList.delete.confirm', 'dhis2IntegrationList.delete')
                .then(function() {
                    loadingModalService.open();
                    return new IntegrationResource()
                        .delete(integration);
                })
                .then(function() {
                    refreshState($stateParams);
                })
                .catch(function(error) {
                    return $q.reject(error);
                })
                .finally(function() {
                    loadingModalService.close();
                })
                .then(function() {
                    notificationService.success('dhis2IntegrationList.scheduleDeleted');
                });
        }

        function refreshState(stateParams) {
            $state.go('openlmis.administration.dhis2.integrations', stateParams, {
                reload: true
            });
            notificationService.success('dhis2IntegrationList.pageHasBeenRefreshed');
        }

    }
})();
