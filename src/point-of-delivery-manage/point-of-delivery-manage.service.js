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
        'facilityFactory', 'authorizationService', '$q', 'localStorageService','$resource','openlmisUrlFactory','pointOfDeliveryManageResource'
    ];

    function pointOfDeliveryManageService(facilityService,facilityFactory, authorizationService, $q,
                                       localStorageService,$resource,openlmisUrlFactory,pointOfDeliveryManageResource) {

        var promise,
            POD_FACILITIES = 'pointOfDeliveryManageFacilities';
           // Using Resource to Communicate with POD Endpoints

            var resource = $resource(openlmisUrlFactory('/api/podEvents:id'), {}, {
                get: {
                    url: openlmisUrlFactory('/api/podEvents'),
                    method: 'GET',
                    isArray: true
                }, 
                savePODEvent: {
                    url: openlmisUrlFactory('/api/podEvents'),
                    method: 'POST'
                }              
            });
 
        this.sendPayload = sendPayload;
        this.getPODs = function(){
            var params = {
                         destinationId: '48794f3d-2842-4d58-83d9-bd07d0fde594'
                    }
                return resource.get(params).$promise.then(function(response) {
                    // Transforming the response to an object if it's an array
                    if (Array.isArray(response)) {
                                  
                            var objectOfObjects = response.reduce((result, obj) => {
                            result[obj.id] = obj;
                            return result;
                          }, {});
                          
                          console.log("Just created these objects to return of length: " + Object.keys(objectOfObjects).length);
    
                        return objectOfObjects; 
                        
                    }
                    return response; // Return the response as is if it's not an array
                });
            }
          
        function sendPayload(payloadData){
            resource.savePODEvent(payloadData);
        }
        
    }
})();