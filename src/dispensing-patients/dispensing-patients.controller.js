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
     * @ngdoc controller
     * @name dispensing-patients.controller:dispensingPatientsController
     *
     * @description
     * Controller for dispensing patients.
     */
    angular
        .module('dispensing-patients')
        .controller('dispensingPatientsController', dispensingPatientsController);

        dispensingPatientsController.$inject = ['$state', '$stateParams', 'facility','facilities', 'facilityService',
        'offlineService', 'dispensingService', 'alertService','patients2'];

    function dispensingPatientsController($state, $stateParams, facility,facilities,offlineService, facilityService,
        dispensingService, alertService, patients2) {

            

        var vm = this;
        vm.addPatientForm = undefined;
        vm.searchPatients = searchPatients;
        vm.$onInit = onInit;
        vm.viewPatients = viewPatients;
        vm.editPatient = editPatient;

        // /**
        //  * @ngdoc property
        //  * @propertyOf dispensing-patients.controller:dispensingPatientsController
        //  * @name patients
        //  * @type {Array}
        //  *
        //  * @description
        //  * Holds patient list.
        //  */
        // vm.patients = undefined;

        /**
         * @ngdoc property
         * @propertyOf dispensing-patients.controller:dispensingPatientsController
         * @name options
         * @type {Object}
         *
         * @description
         * Holds options for sorting patient list.
         */
        vm.options = {
            'dispensingPatients.firstName': ['firstName'],
            'dispensingPatients.lastName': ['lastName'],
            'dispensingPatients.patientNumber': ['patientNumber']
        };

     /**
         * @ngdoc method
         * @methodOf requisition-search.controller:RequisitionViewController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */        
         function onInit() {

            vm.fetchPatients = undefined;
            vm.patientsData = patients2;
            vm.patientParams = {};
            vm.facility = facility;
            vm.facilities = facilities;
            vm.patientParams = {
                facilityLocation: true  // This will select local radio button by default for searching patients
            };
        }

        vm.addPatientForm = function(){

            $state.go('openlmis.dispensing.patients.form');
        }

        function searchPatients(){

            var getPatientParams = vm.patientParams;
            if(getPatientParams.facilityLocation){
                //find the Geographic Zone Id within which the facility is located
               
                getPatientParams.geoZoneId = vm.facility.geographicZone.id;
            }
            else{
                getPatientParams.facilityId = undefined;
            }    
            viewPatients(getPatientParams);   
        }

        function editPatient (patient) {
            $state.go('openlmis.dispensing.patients.form',{
                id: patient.patientNumber
            });
        }


        function viewPatients(patientSearchParams){
            return dispensingService.getPatients(patientSearchParams).then(function(patientsObject) {               
                if (Object.entries(patientsObject).length === 0) {
                    alertService.error("Patient not Found. Try searching Nationally or click on Add Patient to create a record for this patient.");
                }
                else {
                    for (var key in patientsObject) {
                        
                        if (patientsObject.hasOwnProperty(key)) {
                            // Access each patient object to modify its facilityId
                            var patient = patientsObject[key];
                            //Find the Patient's home facility
                            let facility = vm.facilities.filter(item => item.id === patient.facilityId);
                            patient.facilityId = facility[0].name;                      
                        }
                    }
                }
                    vm.patientsData =  patientsObject;
                  
            });
        }
    }
})();
