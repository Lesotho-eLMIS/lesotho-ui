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

    /**
     * @ngdoc controller
     * @name dispensing-prescription-form.controller:dispensingPrescriptionFormController
     *
     * @description
     * Controller for managing prescription list screen.
     */
    angular
        .module('dispensing-prescription-form')
        .controller('dispensingPrescriptionFormController', controller);

    controller.$inject = ['$scope', 'prescriptionsService', 'prepackingService', '$stateParams', 'user', 
        'dispensingService', 'patient', 'orderableGroupService', 'facility', 'products', 'messageService'];

    function controller($scope, prescriptionsService, prepackingService, $stateParams, user,
        dispensingService, patient, orderableGroupService, facility, products, messageService) {

        var vm = this;

        // vm.resetPatientPassword = resetPatientPassword;
        // vm.search = search;
        vm.$onInit = onInit;
        vm.submitPrescription = submitPrescription;
        vm.addProduct = addProduct;
        vm.addContact = addContact;
        //vm.changeToView = changeToView;
        vm.substitute = substitute;
        // vm.getProducts = getProducts;
        vm.patient = undefined;
        vm.facility = undefined;
        vm.user = user;

        // vm.firstName = undefined;
        // vm.lastName = undefined;
        // vm.sex = undefined;
        // vm.age = undefined;
        vm.initiateNewLotObject = initiateNewLotObject;

        //    vm.getPrescriptionProducts = getPrescriptionProducts;
        // vm.searchPatients = searchPatients;
        // vm.viewPrescription = viewPrescription;

        /**
         * @ngdoc property
         * @propertyOf dispensing-prescriptions.controller:dispensingPrescriptionsController
         * @name prescriptions
         * @type {Array}
         *
         * @description
         * Holds prescription list.
         */
        vm.prescriptionDetails = [];
        // vm.prescriptionDetails = {
        //     patientId: " ",
        //     patientType: " ",
        //     followUpDate: " ",
        //     issueDate: " ",
        //     createdDate: " ",
        //     capturedDate: " ",
        //     lastUpdate: " ",
        //     isVoided: false,
        //     status: "INITIATED",
        //     facilityId: " ",
        //     userId: " ",
        //     lineItems: []
        // };

        vm.prescriptionLineItems = [];
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

        vm.orderableGroups = undefined;

        /**
         * @ngdoc method
         * @methodOf dispensing-prescriptions.controller:dispensingPrescriptionsController
         * @name onInit
         *
         * @description
         * Method that is executed on initiating dispensingPrescriptionsController.
         */
        function onInit() {

            vm.inPrescriptionServe = false;
            vm.substituteProduct = false;
           // var Dispense = {};
            //getProducts();
            vm.patient = patient;
            vm.facility = facility;
            vm.user = user;
            vm.orderableGroups = products;
            console.log(vm.facility);
            console.log(vm.patient);
            console.log(vm.user);
            // vm.firstName = patient.personDto.firstName;
            // vm.lastName = patient.personDto.lastName;
            // //condition ? expressionIfTrue : expressionIfFalse
            // vm.sex = patient.personDto.sex == 'F' ? 'Female' : 'Male';
            vm.age = vm.calculateAge(new Date(patient.personDto.dateOfBirth));


            vm.dispensingUnits = ['Capsule(s)', 'Tablet(s)', 'ml', 'mg', 'IU', 'Drop', 'Tablespoon',
                'Teaspoon', 'Unit(s)', 'Puff(s)'];
            vm.dosageFrequency = ['Immediately', '>Once a day', 'Twice a day', 'Thrice a day', 'Every hour', 'Every 2 hours', 'Every 3 hours',
                'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'On alternate days', 'Once a week', 'Twice a week',
                'Thrice a week', 'Every 2 weeks', 'Every 3 weeks', 'Once a month', '5 times a day', '4 days a week', '5 days a week', '6 days a week'];
            vm.doseRoute = ['Intramuscular', 'Intravenous', 'Oral', 'Per Vaginal', 'Sub Cutaneous', 'Per Rectum', 'Sub Lingual', 'Nasogastric',
                'Intradermal', 'Intraperitoneal', 'Intrathecal', 'Intraosseous', 'Topical', 'Nasal', 'Inhalation'];
            vm.durationUnits = ['Day(s)', 'Weeks(s)', 'Month(s)'];
            vm.instructions = ['Before meals', 'Empty stomach', 'In the morning', 'In the evening', 'At bedtime', 'Immediately', 'As directed'];

            // console.log(prescriptionsService.getPrescription());
            // console.log(prescriptionsService.getPrescriptions());


        }


        vm.calculateAge = function (birthDate) {
            var today = new Date();
            var birthDate = new Date(birthDate);
            var ageYears = today.getFullYear() - birthDate.getFullYear();
            var ageMonths = today.getMonth() - birthDate.getMonth();
            var ageDays = today.getDate() - birthDate.getDate();

            if (ageDays < 0) {
                ageMonths--;
                ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            }

            if (ageMonths < 0) {
                ageYears--;
                ageMonths += 12;
            }

            var fullAge = (ageYears + ' years,' + ageMonths + ' months, ' + ageDays + ' days')

            return fullAge;
        }

        function submitPrescription() {
            console.log("CREATING PRESCRIPTION");
            console.log(vm.prescriptionDetails);
            console.log("CREATING PRESCRIPTION");
            console.log(vm.prescriptionDetails.selectedItem);
            // var lineItems = [];
            // vm.prescriptionDetails.

            // var prescriptionData = {
            //         patientId: vm.patient.id,
            //         patientType: vm.prescriptionDetails.patientType ? "In-patient" : "Out-patient",
            //         followUpDate: vm.prescriptionDetails.followUpDate,
            //         issueDate: vm.prescriptionDetails.createdDate,
            //         createdDate:vm.prescriptionDetails.createdDate,
            //         capturedDate: vm.prescriptionDetails.createdDate,
            //         lastUpdate: vm.prescriptionDetails.createdDate,
            //         isVoided: false,
            //         status: "INITIATED",
            //         facilityId: vm.facility.id,
            //         prescribedByUserId: vm.user_id,
            //         servedByUserId: vm.user_id,
            //         "lineItems": [
            //           {
            //             "dose": 10,
            //             "doseUnits": "khaba",
            //             "doseFrequency": "Three times a day",
            //             "route": "ORAL",
            //             "duration": 20,
            //             "durationUnits": "Days",
            //             "additionalInstructions": "Kamora lijo",
            //             "quantityPrescribed": 200,
            //             "remainingBalance": 5,
            //             "orderablePrescribed": "067f4c3d-4a69-413d-8782-d40cb833d09e",
            //             "orderableDispensed": "067f4c3d-4a69-413d-8782-d40cb833d09e",
            //             "lotId": "12f97dd1-26d4-46d0-b995-603e287850f9",
            //             "quantityDispensed": 5,
            //             "servedExternally": false
            //           }
            //         ]
            //       }
            
            // return prescriptionsService.createPrescription(vm.prescriptionDetails).then(function (response) {
            //     console.log(response);
            //     vm.inPrescriptionServe = true;
            // });
        }

        vm.fillPrescrition = function () {
            console.log("Prescription Items:");
            console.log(vm.prescriptionDetails);

            vm.inPrescriptionServe = true;
            //set substitute product to true if prescribed product is out of stock
            vm.prescriptionDetails.forEach(function (item) {
                if(item.selectedItem.stockOnHand === null){
                    vm.substituteProduct = true;
                }
               
            });
        }

        
        vm.orderableSelectionChanged = function () {
            //reset selected lot, so that lot field has no default value
            vm.selectedLot = null;

            initiateNewLotObject();
            vm.canAddNewLot = false;

            //same as above
            $scope.productForm.$setUntouched();

            //make form good as new, so errors won't persist
            $scope.productForm.$setPristine();

            vm.lots = orderableGroupService.lotsOf(
                vm.selectedOrderableGroup,
                vm.hasPermissionToAddNewLot
            );
            vm.selectedOrderableHasLots = vm.lots.length > 0;

            /* eLMIS Lesotho : start */
            vm.lots.splice(1, 1);  //Removing no lot defined because all products should have lots/batches
            /* eLMIS Lesotho : end */
        };

        function initiateNewLotObject() {
            vm.newLot = {
                active: true,
            };
        }

        vm.lotChanged = function () {
            vm.canAddNewLot =
                vm.selectedLot &&
                vm.selectedLot.lotCode ===
                messageService.get('orderableGroupService.addMissingLot');
            initiateNewLotObject();
        }

        function addProduct() {

            var selectedItem;
            // var prescriptionLineItems = [];

            if (vm.selectedOrderableGroup && vm.selectedOrderableGroup.length) {
                vm.newLot.tradeItemId =
                    vm.selectedOrderableGroup[0].orderable.identifiers.tradeItem;
            }

            if (vm.newLot.lotCode) {
                var createdLot = angular.copy(vm.newLot);
                selectedItem = orderableGroupService.findByLotInOrderableGroup(
                    vm.selectedOrderableGroup,
                    createdLot,
                    true
                );
                selectedItem.$isNewItem = true;
            } else {
                selectedItem = orderableGroupService.findByLotInOrderableGroup(
                    vm.selectedOrderableGroup,
                    vm.selectedLot
                );
            }

            vm.newLot.expirationDateInvalid = undefined;
            vm.newLot.lotCodeInvalid = undefined;
            var noErrors =
                !vm.newLot.expirationDateInvalid && !vm.newLot.lotCodeInvalid;

            if (noErrors) {

                // vm.prescriptionLineItems.push({
                //     prescribedProduct: selectedItem.orderable.fullProductName,
                //     soh: selectedItem.stockOnHand
                // });
                console.log(selectedItem);
                vm.prescriptionDetails.unshift(
                    _.extend(
                        {
                           // lineItems: prescriptionLineItems,
                            orderableId: selectedItem.orderable.id,
                            //"substituteOrderableId": "dbaa07c0-66cd-43ed-9272-1d0d8ae7844a",
                            //"exiryDate" "",
                            //prescribedProduct: selectedItem.orderable.fullProductName,
                            soh: selectedItem.stockOnHand,
                            //expiryDate: selectedItem.
                            batchNumber: selectedItem.lot ? vm.selectedProduct.lot : null
                        })
                );
              //  vm.prescriptionDetails.lineItem.push(selectedItem);
                console.log(vm.prescriptionDetails);
            }
        }
        // vm.removeItem = function(index) {
        //     vm.lineItems
        //   };
         
        vm.remove = function (index) {
           vm.prescriptionDetails.splice(index, 1);
        };

        function addContact() {
            console.log("Add line item...");
            vm.contacts.push({
                'phone': '',
                'email': ''
            });
        }

        // function changeToView() {
        //     console.log("qqqqqqqqqqqqqqqqqqqqqqqqq");
        //     vm.inPrescriptionServe = true;
        //     // $state.reload();
        //     // vm.reload();
        // }

        function substitute(lineItem) {
            vm.substituteProduct = true;
        }



        // function viewPrescription(){
        //     console.log("****** View Prescription ******");

        //     $state.go('openlmis.dispensing.prescriptions.form2');

        //     console.log("****** Done ******");

        //     //var stateParams = angular.copy($stateParams);

        //     // stateParams.lastName = vm.lastName;
        //     // stateParams.firstName = vm.firstName;
        //     // stateParams.patientType = vm.patientType;
        //     // stateParams.patientId = vm.patientId;

        //     // stateParams.lastName = "Demo";
        //     // stateParams.firstName = "Dan";
        //     // stateParams.patientType = "Out";
        //     // stateParams.patientId = "F2011/20240711/00045";
        //     //stateParams.status = "Initiated";

        //     // $state.go('openlmis.dispensing.prescriptions.form2', stateParams, {
        //     //     reload: true
        //     // });
        // }

        // function searchPatients(){
        //     var getPatientParams = vm.patientParams;
        //     if(getPatientParams.facilityLocation){
        //         getPatientParams.facilityId = vm.facility.id;
        //     }
        //     else{
        //         getPatientParams.facilityId = undefined;
        //     }    
        //     viewPatients(getPatientParams);   
        // }

        // function viewPatients(patientSearchParams){
        //     return dispensingService.getPatients(patientSearchParams).then(function(patientsObject) {               
        //         for (var key in patientsObject) {
        //                 if (patientsObject.hasOwnProperty(key)) {
        //                     // Access each patient object to modify its facilityId
        //                     var patient = patientsObject[key];
        //                     //Find the Patient's home facility
        //                     let facility = vm.facilities.filter(item => item.id === patient.facilityId);
        //                     patient.facilityId = facility[0].name;                      
        //                 }
        //             }
        //             vm.patientsData =  patientsObject;

        //             console.log("vvvvvvvvvvvvvvvvv");
        //             console.log(vm.patientsData);
        //     });
        // }

        // /**
        //  * @ngdoc method
        //  * @methodOf dispensing-prescriptions.controller:dispensingPrescriptionsController
        //  * @name search
        //  *
        //  * @description
        //  * Reloads page with new search parameters.
        //  */
        // function search() {
        //     var stateParams = angular.copy($stateParams);

        //     stateParams.lastName = vm.lastName;
        //     stateParams.firstName = vm.firstName;
        //     stateParams.patientType = vm.patientType;
        //     stateParams.patientId = vm.patientId;

        //     $state.go('openlmis.dispensing.prescriptions.form', stateParams, {
        //         reload: true
        //     });
        // }
    }

})();
