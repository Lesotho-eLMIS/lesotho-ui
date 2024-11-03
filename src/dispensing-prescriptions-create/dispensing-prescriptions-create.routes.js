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

(function () {

    'use strict';

    angular.module('dispensing-prescriptions-create').config(routes);

    routes.$inject = ['$stateProvider', 'STOCKMANAGEMENT_RIGHTS'];

    function routes($stateProvider, STOCKMANAGEMENT_RIGHTS) {

        $stateProvider.state('openlmis.dispensing.prescriptions.create', {
            label: 'dispensingPrescriptionsCreate.title',
            url: '/form/:patientId',
            accessRights: [STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST],
            views: {
                '@openlmis': {
                    controller: 'dispensingPrescriptionsCreateController',
                    templateUrl: 'dispensing-prescriptions-create/dispensing-prescriptions-create.html',
                    controllerAs: 'vm'
                }
            },
            params: {
                prescriptionId: null ,
                update:null
              },
            resolve: {
                facility: function (facilityFactory, $stateParams) {
                    if (!$stateParams.facility) {
                        return facilityFactory.getUserHomeFacility();
                    }
                    return $stateParams.facility;
                },
                patient: function ($stateParams, dispensingService) {
                    return dispensingService.getPatients($stateParams.patientId).then(function (patientsObject) {
                        for (var key in patientsObject) {
                            if (key == $stateParams.patientId) {
                                return patientsObject[key];
                            }
                        }
                    });
                },
                user: function (authorizationService) {
                    return authorizationService.getUser();
                },
                productsWithSOH: function (prescriptionsService, facility) {
                    return prescriptionsService.getProductsWithSOH(facility.id)
                        .then(function (result) {
                            return result.content;
                        });
                },
                stockCardProducts: function(productsWithSOH, orderableService){
                    var promises = productsWithSOH.map(item => {
                        return orderableService.get(item.orderable.id)
                            .then(result => {
                                item.dispensedProductName = result.fullProductName;
                                return result; 
                            });
                    });                
                    // Return a promise that resolves when all individual promises resolve
                    return Promise.all(promises);
                },
                allProducts2: function (prescriptionsService) {
                    return prescriptionsService.getAllProducts(); // all orderables
                },
                // allProducts: function (prescriptionsService, facility, allProducts2) {
                //     return prescriptionsService.getAllFacilityProducts(facility.id)
                //         .then(function (result) {
                //             return result;
                //         });
                // },
                prescription: function (prescriptionsService, $stateParams) {
                    if($stateParams.prescriptionId){
                        return prescriptionsService.getPrescription($stateParams.prescriptionId);
                    }else{
                        return undefined;
                    }
                    
                }
            }
        });
    }

})();
