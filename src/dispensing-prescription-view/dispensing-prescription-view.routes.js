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

    angular.module('dispensing-prescription-view').config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('openlmis.dispensing.view', {
            label: 'dispensingPrescriptionView.title',
            url: '/prescriptionDetails/',
            //templateUrl: 'dispensing-prescription-view/prescription-form2.html',
            // accessRights: [STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST],

            views: {
                '@openlmis': {
                    controller: 'dispensingPrescriptionView',
                    templateUrl: 'dispensing-prescription-view/dispensing-prescription-view.html',
                    controllerAs: 'vm'
                }
            },
            params: {
                prescriptionId: null,
                patientId: null
            },
            resolve: {
                // facilities: function(facilityService) {
                //     return facilityService.getAllMinimal();
                // },
                facility: function (facilityFactory, $stateParams) {
                    if (!$stateParams.facility) {
                        return facilityFactory.getUserHomeFacility();
                    }
                    return $stateParams.facility;
                },
                // Products: function (prescriptionsService, facility) {
                //     return prescriptionsService.getProductsWithSOH(facility.id)
                //         .then(function (result) {
                //             return result;
                //         });
                // },
                Prescription: function(prescriptionsService, $stateParams) {
                    return prescriptionsService.getPrescription($stateParams.prescriptionId).$promise
                    .then(function(response){
                        return response;
                    });
                },
                Lots: function (Prescription, lotService) {
                    var lots = [];
                    Prescription.lineItems.forEach(function (item) {
                        var hasLot = item.lotId ? true : false;
                        if (hasLot) {
                            lots.push(item.lotId);
                        }
                    })
                    return lotService.query({ id: lots })
                        .then(result => {
                            return result.content;
                        });
                },
                Orderables: function(Prescription, orderableService){
                    var promises = Prescription.lineItems.map(item => {
                        return orderableService.get(item.orderableDispensed)
                            .then(result => {
                               // vm.dispensedProducts.push(result);
                                return result; // Return the result to fulfill the Promise
                            });
                    });                
                    // Return a promise that resolves when all individual promises resolve
                    return Promise.all(promises);
                }
            }
        });
    }
})();
