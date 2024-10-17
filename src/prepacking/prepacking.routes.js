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
        .module('prepacking')
        .config(routes);

routes.$inject = ['$stateProvider', 'PREPACKING_RIGHTS'];

    function routes($stateProvider, PREPACKING_RIGHTS) {
        $stateProvider.state('openlmis.prepacking', {
            isOffline: true,
            url: '/prepacking',
            label: 'prepacking.title',
            priority: 9,
            showInNavigation: true,
            abstract: true,
            template: '<div ui-view></div>',
            accessRights: [
                PREPACKING_RIGHTS.CREATE_PREPACKS,
                PREPACKING_RIGHTS.AUTHORISE_PREPACKS,
                PREPACKING_RIGHTS.VIEW_PREPACKS
            ]
        });
    }
})();
