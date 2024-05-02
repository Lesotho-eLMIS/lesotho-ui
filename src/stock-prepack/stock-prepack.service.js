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
     * @name stock-prepack.prepackingService
     *
     * @description
     * Responsible for retrieving Prepacking data as well as commiting it to the server.
     */
    angular
        .module('stock-prepack')
        .service('prepackingService', prepackingService);

        prepackingService.$inject = ['$resource','openlmisUrlFactory','pointOfDeliveryManageResource', 'openlmisModalService'];

    function prepackingService($resource,openlmisUrlFactory, pointOfDeliveryManageResource, openlmisModalService ) {

        var promise;
        // Using Resource to Communicate with Prepacking Endpoints

        var resource = $resource(openlmisUrlFactory('/api/prepackingEvents:id'), {}, {
                get: {
                    url: openlmisUrlFactory('/api/prepackingEvents'),
                    method: 'GET',
                    isArray: true
                }, 
                postPrepackingEvent: {
                    url: openlmisUrlFactory('/api/prepackingEvents'),
                    method: 'POST'
                },
                updatePrepackingEvent: {
                    url: openlmisUrlFactory('/api/prepackingEvents/:id'),
                    method: 'PUT'
                },
                getPrepackingEvent: {
                    url: openlmisUrlFactory('/api/prepackingEvents/:id'),
                    method: 'GET'
                }

        });

        this.updatePrepacks = updatePrepacks;
        this.getPrepacks = getPrepacks;
        this.getPrepack = getPrepack;
        this.savePrepacks = savePrepacks;

        function updatePrepacks(id,prepackingEvent) {
            return resource.updatePrepackingEvent({ id:id }, prepackingEvent).$promise;
        };

        function getPrepacks(facilityId, programId) {
            var params = {
                facilityId: facilityId, //"3499a089-55b2-45b7-a065-1df2d27d888c",
                programId: programId//"bc5cdc9a-ab05-4f59-8329-b92fcb7eb0c8" 
                };
            return resource.get(params).$promise.then(function(response) {
                // Transforming the response to an object if it's an array
                    if (Array.isArray(response)) {
                                    
                        var objectOfPrepacks = response.reduce((result, obj) => {
                        result[obj.id] = obj;
                       
                        return result;
                        }, {});                        
                        return objectOfPrepacks;                         
                    }
               return response; 
             });
        };

        function getPrepack(prepackId) {
            return resource.getPrepackingEvent({ id: prepackId }).$promise;         
        };

        function savePrepacks(params) {
            return resource.postPrepackingEvent(params);
        };
             
    }
})();