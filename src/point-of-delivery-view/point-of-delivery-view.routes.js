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
        .module('point-of-delivery-view')
        .config(routes);

routes.$inject = ['$stateProvider'/*, 'STOCKMANAGEMENT_RIGHTS', 'ADJUSTMENT_TYPE'*/];

    function routes($stateProvider/*, STOCKMANAGEMENT_RIGHTS, ADJUSTMENT_TYPE*/) {
        $stateProvider.state('openlmis.pointOfDelivery.view', {
            isOffline: true,
            url: '/View?facility&page&size',
            label: 'pointOfDeliveryView.label',
            priority: 1,
            showInNavigation: true,
            views: {
                '@openlmis': {
                    controller: 'pointOfDeliveryViewController',
                    controllerAs: 'vm',
                    templateUrl: 'point-of-delivery-view/point-of-delivery-view.html',
                }
            },
            // params: {
            //     sort: ['packingDate,desc']
            // },

            resolve: {
                facilities: function(facilityService) {
                    var paginationParams = {};                      
                    var queryParams = {
                        "type":"warehouse"
                      };
                      return facilityService.query(paginationParams, queryParams)
                      .then(function(result) {
                          // Return Facilities of Type = Warehouse
                          return result.content;
                      })
                      .catch(function(error) {
                          // Handle any errors that may occur during the query
                          console.error("Error:", error);
                          return [];
                      });                    
                },
                facility: function($stateParams, facilityFactory) {
                    // Load the current User's Assigned Facility
                    if (!$stateParams.facility) {
                        return facilityFactory.getUserHomeFacility();
                    }
                    return $stateParams.facility;
                },
                // requisitions: function(paginationService, requisitionService, $stateParams) {
                //     return paginationService.registerUrl($stateParams, function(stateParams) {
                //         if (stateParams.facility) {
                //             var offlineFlag = stateParams.offline;
                //             delete stateParams.offline;
                //             return requisitionService.search(offlineFlag === 'true', stateParams);
                //         }
                //         return undefined;
                //     });
                // },
                PODs: function(paginationService, pointOfDeliveryService, $stateParams, facility) {
                        return paginationService.registerUrl($stateParams, function(stateParams){
                             if (stateParams){
                                console.log(stateParams);
                                stateParams.facility = facility;
                                console.log("paging POD");
                                //console.log(facility.id);
                                console.log(stateParams);
                                console.log(stateParams.facility);
                                //console.log(pointOfDeliveryService.getPODs(facility.id));
                                //console.log(pointOfDeliveryService.getPODs(stateParams.facility.id));
                               // var records = 
                               // stateParams.sort = 'packingDate,desc';
                               return pointOfDeliveryService.getPODs(stateParams.facility.id);
                               //return undefined;
                            }
                           // console.log(facility.id);
                           console. log("skipped loop");
                            console.log(stateParams);
                           // return pointOfDeliveryService.getPODs(facility.id);
                           // return undefined;
                        });
                        // customPageParamName: 'customPage',
                        // customSizeParamName: 'customSize'
                    }
                     // PODs: function(paginationService, pointOfDeliveryService, $stateParams) {
                //     return paginationService.registerUrl($stateParams, function(stateParams) {
                //         if (stateParams.supplyingFacilityId) {
                //             stateParams.sort = 'createdDate,desc';
                //             return pointOfDeliveryService.getPODs(stateParams);
                //         }
                //         return undefined;
                //     });
                // }
            }
        });
       
     }
})();
  
