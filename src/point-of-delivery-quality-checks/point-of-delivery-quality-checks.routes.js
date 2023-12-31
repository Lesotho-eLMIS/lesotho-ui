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
        .module('point-of-delivery-quality-checks')
        .config(routes);

routes.$inject = ['$stateProvider'/*, 'STOCKMANAGEMENT_RIGHTS', 'ADJUSTMENT_TYPE'*/];

    function routes($stateProvider/*, STOCKMANAGEMENT_RIGHTS, ADJUSTMENT_TYPE*/) {
        $stateProvider.state('openlmis.pointOfDelivery.QualityChecks', {
            isOffline: true,
            url: '/qualityChecks',
            label: 'pointOfDeliveryQualityChecks.label',
            priority: 3,
            showInNavigation: true,
            templateUrl: 'point-of-delivery-quality-checks/point-of-delivery-quality-checks.html',
            controller: 'pointOfDeliveryQualityChecksController',
            controllerAs: 'vm',
            resolve: {
                rejectionReasons: function(rejectionReasonService) {
                        // Load rejection Reasons into the controller.
                        return rejectionReasonService.getAll();
                    
                }
            }
        });
    }
})();
  
