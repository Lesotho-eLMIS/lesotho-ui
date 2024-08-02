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

    controller.$inject = ['$scope', '$state','prescriptionsService', 'prepackingService', '$stateParams', 'user', 
        'dispensingService', 'patient', 'orderableGroupService', 'facility', 'products', 'messageService','confirmService','notificationService', 'productsWithSOH'];

    function controller($scope, $state, prescriptionsService, prepackingService, $stateParams, user,
        dispensingService, patient, orderableGroupService, facility, products, messageService,confirmService,notificationService, productsWithSOH) {

        var vm = this;

        // vm.resetPatientPassword = resetPatientPassword;
        // vm.search = search;
        vm.$onInit = onInit;
        vm.servePrescription = servePrescription;
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
            console.log(productsWithSOH);
            // vm.firstName = patient.personDto.firstName;
            // vm.lastName = patient.personDto.lastName;
            // //condition ? expressionIfTrue : expressionIfFalse
            // vm.sex = patient.personDto.sex == 'F' ? 'Female' : 'Male';
            vm.age = vm.calculateAge(new Date(patient.personDto.dateOfBirth));
           // vm.productsWithSOH = getFullProductDetails(products,productsWithSOH);

            console.log(vm.productsWithSOH);

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

        function getFullProductDetails(A, B) {
           
            var completeProduct = [];
            var allProducts = _.flatten(A);
            var productMap = new Map();

            allProducts.forEach(function(product) {
                const id = product.orderable.id;
                if (!productMap.has(id)) {
                  productMap.set(id, []);
                }
                productMap.get(id).push(product);
              });

              B.forEach(function(item) {
                const id = item.orderable.id;
                const matchingProducts = productMap.get(id) || [];
              
                // Add each matching product to completeProduct with combined data
                matchingProducts.forEach(function(product) {
                  var newProduct = {
                    productId : product.orderable.id,
                    productName: product.orderable.fullProductName,
                    stockOnHand: product.stockOnHand,
                    lot: product.lot ? product.lot.lotCode : null,
                    expiryDate: product.lot ? product.lot.expirationDate : null
                  };
              
                  completeProduct.push(newProduct);
                });
              });
             return completeProduct.filter(product => product.stockOnHand > 0);
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

        function servePrescription() {

            console.log(vm.prescriptionDetails.prescriptionId)
            console.log("CREATING PRESCRIPTION");
            console.log(vm.prescriptionDetails);
            console.log("CREATING PRESCRIPTION");
            console.log(vm.prescriptionDetails.selectedItem);

            confirmService.confirm("Are you sure you want to serve a prescription for "+vm.patient.personDto.firstName+" "+vm.patient.personDto.lastName+"", "Served")
            .then(function () {
                prescriptionsService.servePrescription(vm.prescriptionDetails).$promise
               .then(function(response) {
                console.log(response);
                notificationService.success('Prescription Served.');
                $state.go('openlmis.dispensing.prescriptions');
                 })
              .catch(function(error) {
                  // Error callback
                 // notificationService.error('Failed to submit.');
                  console.error('Error occurred:', error);
              
              });
            });
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

        vm.createPrescrition = function () {
            console.log("Prescription Items:");
            console.log(vm.prescriptionDetails);
            vm.prescriptionDetails.patientId = vm.patient.id;
            vm.prescriptionDetails.facilityId = vm.facility.id;
            vm.prescriptionDetails.userId = vm.user.user_id;

            vm.inPrescriptionServe = true;
            
            
            confirmService.confirm("Are you sure you want to create a prescription for "+vm.patient.personDto.firstName+" "+vm.patient.personDto.lastName+"", "Create")
            .then(function () {
                prescriptionsService.createPrescription(vm.prescriptionDetails).$promise
               .then(function(response) {
                console.log(response);

                // Success callback
                let prescriptionId = "";
                for (let i = 0; i < Object.keys(response).length-2; i++) {
                    prescriptionId += response[i];
                }
                notificationService.success('Prescription Created.');
                //console.log(prescriptionId);
                vm.prescriptionDetails.prescriptionId = prescriptionId;

                prescriptionsService.getPrescription(prescriptionId).$promise
                .then(function(response) {
                    // Success callback
                    vm.inPrescriptionServe = true; 
                    console.log(response)
                    vm.savedPrescriptionDetails = response;
                }).catch(function(error) {
                        // Error callback
                        notificationService.error('Could Not get Prescription.');
                        console.error('Error occurred:', error);
                    
                    });
                  }
              )
              .catch(function(error) {
                  // Error callback
                  notificationService.error('Failed to submit.');
                  console.error('Error occurred:', error);
              
              });
            });
            
            //vm.inPrescriptionServe = true;
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
            //vm.lots.splice(1, 1);  //Removing no lot defined because all products should have lots/batches
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
                angular.extend(selectedItem, {
                    // lineItems: prescriptionLineItems,
                    orderablePrescribed: selectedItem.orderable.id,
                     //"substituteOrderableId": "dbaa07c0-66cd-43ed-9272-1d0d8ae7844a",
                     //"exiryDate" "",
                     orderablePrescribedName: selectedItem.orderable.fullProductName,
                     soh: selectedItem.stockOnHand,
                     //expiryDate: selectedItem.
                     batchNumber: selectedItem.lot ? selectedItem.lot.lotCode : null
                 });
                vm.prescriptionDetails.unshift(selectedItem);
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
