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
        .module('dispensing-patients')
        .config(routes);


routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
      
        $stateProvider.state('openlmis.dispensing.patients', {
            isOffline: true,
            url: '/Patients?lastName&firstName&geoZoneId&page&size',
            templateUrl: 'dispensing-patients/dispensing-patients.html',
            label: 'dispensingPatients.title',
            priority: 2,
            showInNavigation: true,
            controller: 'dispensingPatientsController',
            controllerAs: 'vm',
            resolve: {
                
                facilities: function(facilityService) {
                        return facilityService.getAllMinimal();
                    },
                patients2: function(dispensingService, paginationService, $stateParams ) {
                    return paginationService.registerUrl($stateParams, function(stateParams) {
                        var params = angular.copy(stateParams);
                        return dispensingService.getPatientsV2(params);
                    });
            
                    },
                patients:function(patients2, facilities){
                        return patients2.map(patient => {
                          const facility = facilities.find(facility => facility.id === patient.facilityId);
                          patient.facility = facility ? facility.name : 'Unknown Facility';
                         return patient;
                        });
                      },

                patients3: function(dispensingService, $stateParams, patients2, facilities,patients) {
                        console.log(patients);
                        //console.log(facilities);
                        return patients;
                    },
                facility: function($stateParams, patients, patients2, facilityFactory) {
                    // Load the current User's Assigned Facility
                    if (!$stateParams.facility) {
                        return facilityFactory.getUserHomeFacility();
                    }
                    return $stateParams.facility;
                }
             
            }
            
        });
    }
})();
