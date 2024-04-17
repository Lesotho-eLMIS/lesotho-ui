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
                }            
        });

        this.updatePrepacks = updatePrepacks;
        this.getPrepacks = getPrepacks;
        this.savePrepacks = savePrepacks;

        function updatePrepacks(id,prepackingEvent) {
            var params = {
                facilityId: "3499a089-55b2-45b7-a065-1df2d27d888c",
                programId: "bc5cdc9a-ab05-4f59-8329-b92fcb7eb0c8",
                supervisoryNodeId: "953c7ccf-7a02-4161-b4f6-abb796fa5e3b",
                userId: "3499a089-55b2-45b7-a065-1df2d27d888e",
                status: "initiated",
                comments: "Updated",
                lineItems: [
                        {
                            orderableId: "cf41da7d-07d3-47bc-929e-03331fdfacf4",
                            numberofprepacks: "2",
                            prepackSize: "60",
                            lotId: "3499a089-55b2-45b7-a065-1df2d27d888d",
                            remarks: "V1"  // Ensure this is a normal space
                        }
                    ]
                    

            };
            return resource.updatePrepackingEvent({ id: "41886bb6-27dc-4c83-a75b-a5ba8386dc0d"/*id*/ }, params /*prepackingEvent*/).$promise;
        };

        function getPrepacks() {
            var params = {
                facilityId: "3499a089-55b2-45b7-a065-1df2d27d888c",
                programId: "bc5cdc9a-ab05-4f59-8329-b92fcb7eb0c8" 
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
        };

        function savePrepacks(params) {
            var params = {
                facilityId: "3499a089-55b2-45b7-a065-1df2d27d888c",
                programId: "bc5cdc9a-ab05-4f59-8329-b92fcb7eb0c8",
                supervisoryNodeId: "953c7ccf-7a02-4161-b4f6-abb796fa5e3b",
                userId: "3499a089-55b2-45b7-a065-1df2d27d888e",
                status: "initiated",
                comments: "From Code",
                lineItems: [
                        {
                            orderableId: "cf41da7d-07d3-47bc-929e-03331fdfacf4",
                            numberofprepacks: "2",
                            prepackSize: "60",
                            lotId: "3499a089-55b2-45b7-a065-1df2d27d888d",
                            remarks: "V1"  // Ensure this is a normal space
                        }
                    ]
                    

            };

            /*
            {
                    "facilityId": "3499a089-55b2-45b7-a065-1df2d27d888c",
                    "programId": "bc5cdc9a-ab05-4f59-8329-b92fcb7eb0c8",
                    "supervisoryNodeId": "953c7ccf-7a02-4161-b4f6-abb796fa5e3b",
                    "userId": "3499a089-55b2-45b7-a065-1df2d27d888e",
                    "status": "initiated",
                    "comments": "New On Staging",
                    "lineItems": [
                        {
                            "orderableId": "bf41da7d-07d3-47bc-929e-03331fdfacf5",
                            "numberofprepacks": "2",
                            "prepackSize": "60",
                            "lotId": "3499a089-55b2-45b7-a065-1df2d27d888f",
                            "remarks": "V1"  // Ensure this is a normal space
                        },
                        {
                            "orderableId": "cf41da7d-07d3-47bc-929e-03331fdfacf4",
                            "numberofprepacks": "2",
                            "prepackSize": "60",
                            "lotId": "3499a089-55b2-45b7-a065-1df2d27d888d",
                            "remarks": "V1"  // Ensure this is a normal space
                        }
                        ]
                    }                   
            */
            return resource.postPrepackingEvent(params);
        };
             
    }
})();