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
    * @name dispensing-prescriptions.controller:dispensingPrescriptionsController
    *
    * @description
    * Controller for managing prescription list screen.
    */
   angular
       .module('dispensing-prescriptions')
       .controller('dispensingPrescriptionsController', controller);

       controller.$inject = ['$state', '$stateParams', '$scope', 'facility','facilities', 
       'prescriptionsService', 'dispensingService'];

   function controller($state, $stateParams, $scope, facility,facilities, prescriptionsService, 
       dispensingService ) {

       var vm = this;

       // vm.resetPatientPassword = resetPatientPassword;
       vm.search = search;
       vm.$onInit = onInit;
       vm.searchPatients = searchPatients;
       vm.viewPrescription = viewPrescription;
       //vm.goToCreatePrescriptionForm = goToCreatePrescriptionForm;

       /**
        * @ngdoc property
        * @propertyOf dispensing-prescriptions.controller:dispensingPrescriptionsController
        * @name prescriptions
        * @type {Array}
        *
        * @description
        * Holds prescription list.
        */
       vm.prescriptions = undefined;

       /**
        * @ngdoc property
        * @propertyOf dispensing-prescriptions.controller:dispensingPrescriptionsController
        * @name status
        * @type {String}
        *dispensingPrescriptionsController
        * @description
        * Holds prescription status filter value.
        */
       vm.status = undefined;

       /**
        * @ngdoc property
        * @propertyOf dispensing-prescriptions.controller:dispensingPrescriptionsController
        * @name createdDate
        * @type {String}
        *
        * @description
        * Holds prescription date created filter value.
        */
       vm.createdDate = undefined;


       /**
        * @ngdoc property
        * @propertyOf dispensing-prescriptions.controller:dispensingPrescriptionsController
        * @name options
        * @type {Object}
        *
        * @description
        * Holds options for sorting prescription list.
        */
       vm.options = {
           'dispensingPrescriptions.createdDate': ['createdDate'],
           'dispensingPrescriptions.dateCaptured': ['dateCaptured']
       };

       /**
        * @ngdoc method
        * @methodOf dispensing-prescriptions.controller:dispensingPrescriptionsController
        * @name onInit
        *
        * @description
        * Method that is executed on initiating dispensingPrescriptionsController.
        */
       function onInit() {
            vm.status = ["INITIATED","RETURNED","CANCELLED","PARTIALLY_SERVED","FULLY_SERVED"];
           vm.fetchPatients = undefined;
           vm.patientsData = undefined;
           vm.prescriptionParams = {};
           vm.facility = facility;
           vm.facilities = facilities;
           console.log($stateParams);
           vm.fetchPatient();
           vm.fetchAllPrescriptions();
       }

       function viewPrescription(prescription){
           console.log("****** View Prescription ******");

           $state.go('openlmis.dispensing.view', {
            prescriptionId: prescription.id,
            patientId: prescription.patientId
        });

          // $state.go('openlmis.dispensing.prescriptions.form2');
           
           console.log("****** Done ******");

       }

       //fetches prescriptions for a single patient
        vm.fetchAllPrescriptions = function(){
            //var patientNum = '09018273934';
            var searchParams = vm.prescriptionParams;
            { searchParams.isVoided =  false };
            console.log(vm.prescriptionParams);
           var pres= prescriptionsService.getPrescriptions(vm.prescriptionParams)
           .then(function(response){
            vm.prescriptionsData = response;
            if(response){
                response.forEach()
            }
            console.log("Prescriptions Object", vm.prescriptionsData);
           });
      //     $scope.prescriptionsList.$setPristine();
           console.log("All Prescriptions", pres);
        }

        vm.fetchPatient = function(){

            var patient = dispensingService.getPatient($stateParams.patientId);
            console.log("PATIENT", patient);

        }


       function searchPatients(){
           var getPatientParams = vm.patientParams;
           if(getPatientParams.facilityLocation){
               getPatientParams.facilityId = vm.facility.id;
           }
           else{
               getPatientParams.facilityId = undefined;
           }    
           viewPatients(getPatientParams);   
       }

       function viewPatients(patientSearchParams){
           return dispensingService.getPatients(patientSearchParams).then(function(patientsObject) {               
               for (var key in patientsObject) {
                       if (patientsObject.hasOwnProperty(key)) {
                           // Access each patient object to modify its facilityId
                           var patient = patientsObject[key];
                           //Find the Patient's home facility
                           let facility = vm.facilities.filter(item => item.id === patient.facilityId);
                           patient.facilityId = facility[0].name;                      
                       }
                   }
                   vm.patientsData =  patientsObject;

                   console.log("vvvvvvvvvvvvvvvvv");
                   console.log(vm.patientsData);
           });
       }

       /**
        * @ngdoc method
        * @methodOf dispensing-prescriptions.controller:dispensingPrescriptionsController
        * @name search
        *
        * @description
        * Reloads page with new search parameters.
        */
       function search() {
           var stateParams = angular.copy($stateParams);

           stateParams.lastName = vm.lastName;
           stateParams.firstName = vm.firstName;
           stateParams.patientType = vm.patientType;
           stateParams.patientId = vm.patientId;

           $state.go('openlmis.dispensing.prescriptions.form', stateParams, {
               reload: true
           });
       }

    //    function goToCreatePrescriptionForm(patient) {
    //     console.log("xxxxxxxxxx patient xxxxxxxxxx");
    //     console.log(patient);
    //         $state.go('openlmis.dispensing.prescriptions.form({patientId: patient.id})', {
    //             patient: patient
    //         });
    //    }
   }

})();