
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
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    angular
        .module('prepacking-view')
        .config(routes);


routes.$inject = ['$stateProvider', 'STOCKMANAGEMENT_RIGHTS'];

    function routes($stateProvider, STOCKMANAGEMENT_RIGHTS) {
      
        $stateProvider.state('openlmis.prepacking.view', {
            isOffline: true,
            url: '/view',
            templateUrl: 'prepacking-view/prepacking-view.html',
            label: 'prepackingView.label',
            priority: 1,
            showInNavigation: true,
            controller: 'prepackingViewController',
            controllerAs: 'vm',
            accessRights: [STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST],
            resolve: {
                facility: function($stateParams, facilityFactory) {
                    // Load the current User's Assigned Facility
                    if (!$stateParams.facility) {
                        return facilityFactory.getUserHomeFacility();
                    }
                    return $stateParams.facility;
                },
                user: function(authorizationService) {
                    return authorizationService.getUser();
                },
                programs: function(user, stockProgramUtilService) {
                    var programs =  stockProgramUtilService.getPrograms(user.user_id, STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST);
                    return programs;
                },
                Prepacks: function(facility, programs, prepackingService ) {      
                   // Make this dynamic         
                   return prepackingService.getPrepacks(facility.id, 'bc5cdc9a-ab05-4f59-8329-b92fcb7eb0c8')//'3499a089-55b2-45b7-a065-1df2d27d888c', 'bc5cdc9a-ab05-4f59-8329-b92fcb7eb0c8' );
                },
                prepackStage: function() {
                    return 'view';
                }
            }           
      
        });
    }
})();
