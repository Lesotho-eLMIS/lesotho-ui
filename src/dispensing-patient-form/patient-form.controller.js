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
     * @name dispensing-patient-form.controller:patientFormController
     *
     * @description
     * Exposes method for creating/updating patient to the modal view.
     */
    angular
        .module('dispensing-patient-form')
        .controller('patientFormController', controller);

    controller.$inject = ['dispensingService', '$scope', 'facility','patient','patientState'];

    function controller(dispensingService, $scope, facility, patient, patientState) {

        var vm = this;

        vm.$onInit = onInit;
        vm.contacts = []; 
        vm.patient = {};
        vm.addContact = addContact;
        vm.removeContact = removeContact;
        vm.viewTitle = undefined;
       // vm.submitPatientData = submitPatientData;

        /**
         * @ngdoc method
         * @methodOf dispensing-patient-form.controller:patientFormController
         * @name $onInit
         *
         * @description
         * Initialization method of the PatientFormModalController.
         */
        function onInit() {
            console.log(patient);
            vm.viewTitle = (patientState === "New") ? "Add Patient" : "Edit Patient";
            vm.contactOptions = ["email", "phone"];

           // console.log("...In init...")
        }

        /**
         * @ngdoc method
         * @methodOf dispensing-patient-form.controller:patientFormController
         * @name addContact
         *
         * @description
         * Add another line item for a Contact
         *
         */
        function addContact() {
            console.log("Add line item..."); 
                vm.contacts.push({
                    contactType: '',
                    contactValue: ''
                }); 
           // }
             
        }

        // removing discrepancies from table
        function removeContact(index) {
            console.log("Remove...");
            console.log(index);
            vm.contacts.splice(index, 1);
        }

        vm.submitPatientData = function(){
            
            var patientInfo = vm.patient;
            patientInfo.homeFacility = facility.id;
            dispensingService.submitPatientInfo(patientInfo);
        }
    }
})();
