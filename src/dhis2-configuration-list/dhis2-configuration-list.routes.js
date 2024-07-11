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

    angular
        .module('dhis2-configuration-list')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider.state('openlmis.administration.dhis2.configurations', {
            label: 'dhis2.configurations',
            url: '/configurations?page&size',
            controller: 'ConfigurationListController',
            templateUrl: 'dhis2-configuration-list/dhis2-configuration-list.html',
            controllerAs: 'vm',
            resolve: {
                configurations: function(paginationService, ConfigurationResource, $stateParams) {
                    return paginationService.registerUrl($stateParams, function(stateParams) {
                        return new ConfigurationResource().query(stateParams);
                    });
                }
            }
        });
    }
})();
