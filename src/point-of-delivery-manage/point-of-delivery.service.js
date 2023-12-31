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
     * @name point-of-delivery-manage.pointOfDeliveryService
     *
     * @description
     * Prepares data for the Point of Delivery Manage view.
     */
    angular
        .module('requisition-search')
        .service('pointOfDeliveryService', pointOfDeliveryService);

        pointOfDeliveryService.$inject = ['facilityService', 'facilityFactory', 'authorizationService', '$q', '$stateParams',
        '$state', 'localStorageService','$resource','openlmisUrlFactory','pointOfDeliveryManageResource'
    ];

    function pointOfDeliveryService(facilityService,facilityFactory, authorizationService, $q, $stateParams, $state,
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
 
        this.submitPodManage = submitPodManage; // To post data POD Manage payload

        this.submitQualityDiscrepancies = submitQualityDiscrepancies;


        //To fetch POD records.
        this.getPODs = function(receivingFacilityId){

            var params = {
                         destinationId: receivingFacilityId 
                    }
                return resource.get(params).$promise.then(function(response) {
                    // Transforming the response to an object if it's an array
                    if (Array.isArray(response)) {
                                  
                            var objectOfPODs = response.reduce((result, obj) => {
                            result[obj.id] = obj;
                            return result;
                          }, {});                          
  
                        return objectOfPODs;                         
                    }
                    return response; 
                });
            }
          
        function submitPodManage(payloadData){
            return resource.savePODEvent(payloadData);
        }

        function submitQualityDiscrepancies(discrepancyPayload){
            console.log("discrepancyPayload in service");
            console.log(discrepancyPayload);
        }
        
    }
})();