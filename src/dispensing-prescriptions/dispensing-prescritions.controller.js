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
       'prescriptionsService', 'dispensingService', 'prescriptions'];

   function controller($state, $stateParams, $scope, facility,facilities, prescriptionsService, 
       dispensingService, prescriptions ) {

       var vm = this;

       vm.search = search;
       vm.$onInit = onInit;
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
           vm.prescriptionsData = prescriptions;
           console.log($stateParams);
       }

       function viewPrescription(prescription) {
        console.log(prescription);
           if (prescription.status === 'INITIATED' || prescription.status === "PARTIALLY_SERVED") {
                    $state.go('openlmis.dispensing.prescriptions.form', {
                    prescriptionId: prescription.id,
                    patientId: prescription.patientId,
                    update: true
                })
               
           } else {
               $state.go('openlmis.dispensing.view', {
                   prescriptionId: prescription.id,
                   patientId: prescription.patientId
               });
           }

       }

       
        vm.fetchAllPrescriptions = function(){
 
            var searchParams = vm.prescriptionParams;
            { searchParams.isVoided =  false };
            console.log(vm.prescriptionParams);
           var pres= prescriptionsService.getPrescriptions(vm.prescriptionParams)
           .then(function(response){
            vm.prescriptionsData = response;
            // vm.prescriptionsData.patientType = response.patientType ? "In-Patient" : "Out-Patient";
            //     console.log("Prescriptions Object", vm.prescriptionsData);
           });
      //     $scope.prescriptionsList.$setPristine();
           console.log("All Prescriptions", pres);
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
           var stateParams = {page: $stateParams.page, size: $stateParams.size}; // Reset State Params
           stateParams = angular.extend(stateParams, vm.prescriptionParams);
            console.log(stateParams);
           $state.go('openlmis.dispensing.prescriptions', stateParams, {
               reload: true,
               inherit: false,
           });
       }
   }

})();