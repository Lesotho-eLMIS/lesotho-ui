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

    controller.$inject = ['dispensingService', 'notificationService', 'facility', '$scope', '$http', 'confirmService', 'alertService', 'patient','patientState'];

    function controller(dispensingService, notificationService, facility, $scope, $http, confirmService, alertService, patient, patientState) {

        var vm = this;

        vm.$onInit = onInit;
        vm.maxDate = new Date();
        vm.maxDate.setHours(23, 59, 59, 999);
        vm.contacts = []; 
        vm.patient = {};
        vm.addContact = addContact;
        vm.estimateDOB = estimateDOB;
        vm.calculateAge = calculateAge;
        vm.removeContact = removeContact;
        vm.initialisePatient = initialisePatient;
       // vm.submitPatientData = submitPatientData;

       vm.tbStatusOptions =['No signs', 'TB Presumptive Case', 'On DS TB Treatment', 'On DR TB Treatment'];

       ////////////////////////////////////////////////////////////////////////////////////
       // Fetch data from JSON file
        // $http.get('../assets/dispensing-patient-form/data.json')
        // .then(function(response) {
        //     // Store the array in $scope
        //     $scope.items = response.data;
        //     console.log("&&&&&&&&&&&&&&&&&&&&&&&");
        //     console.log($scope.items);
        //     console.log("&&&&&&&&&&&&&&&&&&&&&&&");
        // })
        // .catch(function(error) {
        //     console.error('Error loading JSON file:', error);
        // });
       ////////////////////////////////////////////////////////////////////////////////////
        $scope.VillageSuggestions = ['HA KOPORALA, Tenesolo, Thaba-Tseka', 
            'HA PAKI, Mohlakeng, Maseru', 
            'HA MATALA, Maseru (Maseru District), Maseru', 
            'HA ABIA, Maseru (Maseru District), Maseru', 
            'HA LEPOLESA, Tebe-Tebe, Berea', 
            'MABOTHILE, Botha-Bothe (Leribe District), Leribe'];

        $scope.village = ['HA KOPORALA', 'HA PAKI', 'HA MATALA', 'HA ABIA', 'HA LEPOLESA', 'MABOTHILE'];
        $scope.district = ['Thaba-Tseka', 'Maseru', 'Maseru', 'Maseru', 'Berea', 'Leribe'];
        $scope.constituancy = ['Tenesolo', 'Mohlakeng', 'Maseru (Maseru District)', 'Maseru (Maseru District)', 'Tebe-Tebe', 'Botha-Bothe (Leribe District)'];
        
        vm.patient.village = '';
        $scope.filteredVillageSuggestions = [];

        $scope.onChange = function() {
            if (vm.patient.village) {
                $scope.filteredVillageSuggestions = $scope.VillageSuggestions.filter(function(VillageSuggestion) {
                    return VillageSuggestion.toLowerCase().indexOf(vm.patient.village.toLowerCase()) !== -1;
                });
            } else {
                $scope.filteredVillageSuggestions = [];
            }
        };

        $scope.selectVillageSuggestion = function(VillageSuggestion) {
            vm.patient.village = $scope.village[$scope.VillageSuggestions.indexOf(VillageSuggestion)];
            vm.patient.district = $scope.district[$scope.VillageSuggestions.indexOf(VillageSuggestion)];
            vm.patient.constituancy = $scope.constituancy[$scope.VillageSuggestions.indexOf(VillageSuggestion)];
            $scope.filteredVillageSuggestions = [];
        };
        /////////////////////////////////////////////////////////////////////////////////////

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
            vm.updateMode = (patientState === "New") ? false : true;
            vm.facility = facility;
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
            
                vm.contacts.push({
                    contactType: '',
                    contactValue: ''
                }); 
           // }
             
        }

        function calculateAge() {
            var birthDate = new Date(vm.patient.dateOfBirth);
            var today = new Date();
            var age = today.getFullYear() - birthDate.getFullYear();
            var monthDiff = today.getMonth() - birthDate.getMonth();
            // If the current date is before the birth date, subtract one year from age
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            vm.patient.age=age;
        }

        function estimateDOB() {
            vm.patient.dateOfBirth = ((new Date().getFullYear())-vm.patient.age)+"-01-01";///1/2//2020-01-01
            vm.patient.isDobEstimated = true;
        }

        // removing discrepancies from table
        function removeContact(index) {
            vm.contacts.splice(index, 1);
        }

        vm.submitMode =  function() {
            if (vm.updateMode) {
               
                vm.savePatientUpdates();
            } else {
                
                vm.submitPatientData();
            }
        }

        vm.submitPatientData = function(){

            //Saving New Patient
            confirmService.confirm("Are you sure you want to create this patient?", 'Submit')
            .then(function () {
                var patientInfo = vm.patient;
              
                patientInfo.facilityId = vm.facility.id;
                patientInfo.geoZoneId = vm.facility.geographicZone.id;
              
                dispensingService.submitPatientInfo(patientInfo).then(function(response) {
                    //clearing all the fields
                    vm.patient.nationalID = "";
                    vm.patient.firstName = "";
                    vm.patient.lastName = "";
                    vm.patient.nickName = "";
                    vm.patient.dateOfBirth = "";
                    vm.patient.isDobEstimated = "";
                    vm.patient.physicalAddress = "";
                    vm.patient.contact = "";
                    vm.patient.motherMaidenName = "";
                    vm.patient.nextOfKinFullName = "";
                    vm.patient.nextOfKinContact = "";
                    vm.patient.sex = null;
                    vm.patient.deceased = null;
                    vm.patient.retired = null;
                    vm.patient.village = "";
                    vm.patient.district = "";
                    vm.patient.constituancy = "";
                    vm.patient.age = "";
                    vm.patient.chief = "";
                    vm.patient.occupation = "";
                    // Adding success message when Patient saved.
                    notificationService.success('Successfully submitted.');   
                }).catch(function(error) {
                    notificationService.error('Failed to submit.');
                    console.error('Error occurred:', error);
                });
            });
        }

        vm.savePatientUpdates = function(){
            //Updating Patient
            confirmService
            .confirm("Are you sure you want to Update this patient?", 'Yes')
            .then(function () {
                var patientInfo = vm.patient;
                patientInfo.homeFacility = facility.id;
               
                dispensingService.updatePatientInfo(patientInfo).then(function(response) {
                    //clearing all the fields
                    vm.patient.nationalID = "";
                    vm.patient.firstName = "";
                    vm.patient.lastName = "";
                    vm.patient.nickName = "";
                    vm.patient.DOB = "";
                    vm.patient.dateOfBirthEstimated = "";
                    vm.patient.physicalAddress = "";
                    vm.patient.contact = "";
                    vm.patient.motherMaidenName = "";
                    vm.patient.nextOfKinNames = "";
                    vm.patient.nextOfKinContact = "";
                    vm.patient.sex = null;
                    vm.patient.village = "";
                    vm.patient.district = "";
                    vm.patient.constituancy = "";
                    vm.patient.age = "";
                    vm.patient.chief = "";
                    vm.patient.occupation = "";
                    // Adding success message when Patient saved.
                    notificationService.success('Successfully submitted.');   
                }).catch(function(error) {
                    notificationService.error('Failed to submit.');
                    console.error('Error occurred:', error);
                });
                              
            });
        }

        function initialisePatient (patientObj) {
            const patientArray = Object.values(patientObj)[0];
            
            vm.patient.patientNumber = patientArray.patientNumber;
            vm.patient.nationalID = patientArray.personDto.nationalId;
            vm.patient.firstName = patientArray.personDto.firstName;
            vm.patient.lastName = patientArray.personDto.lastName;
            vm.patient.nickName = patientArray.personDto.nickName;
            vm.patient.sex = patientArray.personDto.sex;
            vm.patient.dateOfBirth = patientArray.personDto.dateOfBirth;
            vm.patient.isDobEstimated = patientArray.personDto.isDobEstimated;
            calculateAge();
            vm.patient.physicalAddress = patientArray.personDto.physicalAddress;
            vm.patient.nextOfKinNames = patientArray.personDto.nextOfKinFullName; 
            vm.patient.nextOfKinContact = patientArray.personDto.nextOfKinContact;
            vm.patient.motherMaidenName = patientArray.personDto.motherMaidenName;
            vm.patient.deceased = patientArray.personDto.deceased;
            vm.patient.retired = patientArray.personDto.retired;
            vm.patient.id = patientArray.id;
            vm.patient.chief = patientArray.personDto.chief;
            vm.patient.occupation = patientArray.personDto.occupation;

            vm.patient.contact = patientArray.personDto.contacts[0].contactValue
          //  vm.patient.contact.contactValue = patientArray.personDto.contacts[0].contactValue ? patientArray.personDto.contacts[0].contactValue : "";
           
            return vm.patient;
        }
    }
})();
