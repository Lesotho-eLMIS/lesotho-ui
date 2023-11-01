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
     * @ngdoc service
     * @name point-of-delivery-manage.pointOfDeliveryManageService
     *
     * @description
     * Prepares data for the Point of Delivery Manage view.
     */
    angular
        .module('requisition-search')
        .service('pointOfDeliveryManageService', pointOfDeliveryManageService);

        pointOfDeliveryManageService.$inject = ['facilityService',
        'facilityFactory', 'authorizationService', '$q', 'localStorageService'
    ];

    function pointOfDeliveryManageService(facilityService,facilityFactory, authorizationService, $q,
                                       localStorageService) {

        var promise,
            POD_FACILITIES = 'pointOfDeliveryManageFacilities';

        this.getFacilities = getFacilities;
        this.clearCachedFacilities = clearCachedFacilities;

        /**
         * @ngdoc method9
         * @methodOf requisition-search.requisitionSearchService
         * @name getFacilities
         *
         * @description
         * Prepares the list of facilities to be displayed on the Requisition Search view.
         * 
         * @return {Array}  the list of facilities based on both permission strings and role assignments for partner
         *                  nodes
         */
        function getFacilities() {
            if (promise) {
                return promise;
            }

        
            var cachedFacilities = localStorageService.get(POD_FACILITIES);
            if (cachedFacilities) {
                promise = $q.resolve(angular.fromJson(cachedFacilities));
            } else {
                promise = $q
                    .all([
                        facilityService.query()
                    ]);
                    }

            return promise;
        }

        
    }

})();