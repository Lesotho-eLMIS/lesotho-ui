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
        .module('dhis2-configuration-edit')
        .config(dhis2ConfigurationEditRoutes);

    dhis2ConfigurationEditRoutes.$inject = ['modalStateProvider'];

    function dhis2ConfigurationEditRoutes(modalStateProvider) {

        modalStateProvider.state('openlmis.administration.dhis2.configurations.edit', {
            controller: 'ConfigurationAddEditController',
            controllerAs: 'vm',
            templateUrl: 'dhis2-configuration-edit/dhis2-configuration-edit.html',
            url: '/:id/edit',
            resolve: {
                configuration: function(ConfigurationResource, Configuration, $stateParams) {
                    return new ConfigurationResource()
                        .get($stateParams.id)
                        .then(function(json) {
                            return new Configuration(json);
                        });
                }
            }
        });

    }

})();
