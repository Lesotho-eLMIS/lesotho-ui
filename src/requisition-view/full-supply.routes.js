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
        .module('requisition-view')
        .config(routes);

    routes.$inject = ['selectProductsModalStateProvider'];

    function routes(selectProductsModalStateProvider) {
        selectProductsModalStateProvider
            .stateWithAddOrderablesChildState('openlmis.requisitions.requisition.fullSupply', {
                url: '/fullSupply?fullSupplyListPage&fullSupplyListSize',
                templateUrl: 'requisition-view-tab/requisition-view-tab.html',
                controller: 'ViewTabController',
                controllerAs: 'vm',
                isOffline: true,
                nonTrackable: true,
                resolve: {
                    facility: function($stateParams, facilityFactory) {
                        // Load the current User's Assigned Facility
                        if (!$stateParams.facility) {
                            return facilityFactory.getUserHomeFacility();
                        }
                        return $stateParams.facility;
                    },
                    lineItems: function($filter,facilityService,requisition,facility) {
                        var filterObject = requisition.template.hideSkippedLineItems() ?
                            {
                                skipped: '!true',
                                $program: {
                                    fullSupply: true
                                }
                            } : {
                                $program: {
                                    fullSupply: true
                                }
                            };
                        var fullSupplyLineItems = $filter('filter')(requisition.requisitionLineItems, filterObject);
                        
                        //Auto Populate requested quantity with calculatedOrderQuantity when the requisition is still in the Initiated State on lineItems where requestedQuantity is not filled.
                        if(requisition.status === "INITIATED"){
                            fullSupplyLineItems.forEach(item => {
                                if(item.requestedQuantity === undefined){
                                    item.requestedQuantity = item.calculatedOrderQuantity;
                                }
                                
                            });
                        }
                        //Check whether product being requested from Service Point has stock on hand at Facility Store
                        const cfcode = facility.code;
                        const fcode = cfcode.substring(0, 5);
                        var paginationParams = {};                      
                        var queryParams = {
                            "code":fcode
                        };
                      
                      facilityService.query(paginationParams, queryParams)
                      .then(function(result) {
                          const mainStoreFacilityCode = result.content.filter(facility => facility.code === fcode);
                          console.log(mainStoreFacilityCode);
                      })
                      .catch(function(error) {
                          // Handle any errors that may occur during the query
                          console.error("Error:", error);
                      });                    
                            
                        fullSupplyLineItems.forEach(item =>{
                            console.log(item);
                            //Parent Facility Code
                           
                        }) 
                        return $filter('orderBy')(fullSupplyLineItems, [
                            '$program.orderableCategoryDisplayOrder',
                            '$program.orderableCategoryDisplayName',
                            '$program.displayOrder',
                            'orderable.fullProductName'
                        ]);
                    },
                    items: function(paginationService, lineItems, $stateParams, requisitionValidator,
                        paginationFactory) {
                        return paginationService.registerList(
                            requisitionValidator.isLineItemValid, $stateParams, function(params) {
                                return paginationFactory.getPage(lineItems, parseInt(params.page),
                                    parseInt(params.size));
                            }, {
                                paginationId: 'fullSupplyList'
                            }
                        );
                    },
                    columns: function(requisition) {
                        return requisition.template.getColumns(requisition.emergency);
                    },
                    fullSupply: function() {
                        return true;
                    }
                }
            });
    }

})();
