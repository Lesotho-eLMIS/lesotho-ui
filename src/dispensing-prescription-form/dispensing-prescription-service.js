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
     * @name dispensing-prescriptions.dispensingPrescriptionsService
     *
     * @description
     * Responsible for prescriptions data as well as commiting it to the server.
     */

    angular
    .module('dispensing-prescriptions')
    .service('dispensingPrescriptionsService', dispensingPrescriptionsService);

dispensingPrescriptionsService.$inject = ['$resource', 'openlmisUrlFactory'];

function dispensingPrescriptionsService($resource, openlmisUrlFactory) {
    // Define the base URL using openlmisUrlFactory
    const resource = $resource(openlmisUrlFactory('/api/v2/allStockCardSummaries'), {}, {
        getAll: {
            method: 'GET',
            params: { facilityId: '@facilityId' } // Correctly define the params object
        }
    });

    // Expose the getDispensingProducts method as a service method
    this.getDispensingProducts = getDispensingProducts;

    /**
     * @ngdoc method
     * @name dispensingPrescriptionsService#getDispensingProducts
     * @methodOf dispensing-prescriptions
     *
     * @description
     * Retrieves Prescription details for a given facility.
     *
     * @param  {String} facilityId Facility UUID
     * @return {Promise} Promise resolving to an object of prescription details
     */
    function getDispensingProducts(facilityId) {
        // Create parameters for the resource call
        const params = { facilityId: facilityId };     
          
            return resource.getAll(params).$promise.then(function(response) {
              //Transforming the response to an object if it's an array
                    console.log(response);
                    return response.content;
            });
    }
}    
})();