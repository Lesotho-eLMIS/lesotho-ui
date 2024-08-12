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

    controller.$inject = ['dispensingService', 'notificationService', 'facility', '$scope', 'confirmService', 'alertService', 'patient','patientState'];

    function controller(dispensingService, notificationService, facility, $scope, confirmService, alertService, patient, patientState) {

        var vm = this;

        vm.$onInit = onInit;
        vm.maxDate = new Date();
        vm.maxDate.setHours(23, 59, 59, 999);
        vm.contacts = []; 
        vm.patient = {};
        vm.addContact = addContact;
        vm.removeContact = removeContact;
        vm.initialisePatient = initialisePatient;
       // vm.submitPatientData = submitPatientData;

       vm.tbStatusOptions =['No signs', 'TB Presumptive Case', 'On DS TB Treatment', 'On DR TB Treatment'];

        /**
         * @ngdoc method
         * @methodOf dispensing-patient-form.controller:patientFormController
         * @name $onInit
         *
         * @description
         * Initialization method of the PatientFormModalController.
         */
        function onInit() {
            vm.viewTitle = (patientState === "New") ? "Add Patient" : "Edit Patient";
            vm.patient = !(patientState === "New")? vm.initialisePatient(patient) : {};
            vm.contactOptions = ["email", "phone"];

            console.log("...In init...")
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

            //Saving New Patient
            confirmService
            .confirm("Are you sure you want to create this patient?", 'Submit')
            .then(function () {
                var patientInfo = vm.patient;
                patientInfo.homeFacility = facility.id;

                console.log(patientInfo);
                var response = dispensingService.submitPatientInfo(patientInfo);
                if (response) {
                        // Adding success message when Patient saved.
                    notificationService.success('Successfully submitted.');
                } else {
                    notificationService.error('Failed to submit.');
                }

                //clearing all the fields
                vm.patient.nationalID = "";
                vm.patient.firstName = "";
                vm.patient.lastName = "";
                vm.patient.nickName = "";
                vm.patient.DOB = "";
                vm.patient.dateOfBirthEstimated = "";
                vm.patient.physicalAddress = "";
                vm.patient.contact.contactValue = "";
                vm.patient.motherMaidenName = "";
                vm.patient.nextOfKinNames = "";
                vm.patient.nextOfKinContact = "";
                vm.patient.sex = null;
            });
        }

        function initialisePatient (patientObj) {
            const patientArray = Object.values(patientObj)[0];
            console.log(patientArray);
            vm.patient.patientNumber = patientArray.patientNumber;
            vm.patient.nationalID = patientArray.personDto.nationalId;
            vm.patient.firstName = patientArray.personDto.firstName;
            vm.patient.lastName = patientArray.personDto.lastName;
            vm.patient.nickName = patientArray.personDto.nickName;
            vm.patient.sex = patientArray.personDto.sex;
            vm.patient.DOB = patientArray.personDto.dateOfBirth;
            vm.patient.dateOfBirthEstimated = patientArray.personDto.isDobEstimated;
            vm.patient.physicalAddress = patientArray.personDto.physicalAddress;
            vm.patient.nextOfKinNames = patientArray.personDto.nextOfKinFullName; 
            vm.patient.nextOfKinContact = patientArray.personDto.nextOfKinContact;
            vm.patient.motherMaidenName = patientArray.personDto.motherMaidenName;
            vm.patient.deceased = patientArray.personDto.deceased;
            vm.patient.retired = patientArray.personDto.retired;
          //  vm.patient.contact.contactValue = patientArray.personDto.contacts[0].contactValue ? patientArray.personDto.contacts[0].contactValue : "";
            //console.log(vm.patient);
            return vm.patient;
        }
    }
})();
