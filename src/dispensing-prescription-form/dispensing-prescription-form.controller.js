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

    controller.$inject = ['$scope', '$state', 'prescriptionsService', 'allProducts', 'prepackingService', '$stateParams', 'user',
        'dispensingService', 'patient', 'orderableGroupService', 'facility', 'messageService', 'confirmService', 'notificationService', 'productsWithSOH'];

    function controller($scope, $state, prescriptionsService, allProducts, prepackingService, $stateParams, user,
        dispensingService, patient, orderableGroupService, facility, messageService, confirmService, notificationService, productsWithSOH) {

        var vm = this;


        vm.$onInit = onInit;
        vm.servePrescription = servePrescription;
        vm.addProduct = addProduct;
        vm.substitute = substitute;
        vm.editPrescription = editPrescription;
        vm.patient = undefined;
        vm.facility = undefined;
        vm.user = user;

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
        vm.dispensingProducts = [];
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
            vm.patient = patient;
            vm.facility = facility;
            vm.user = user;
            vm.orderableGroups = productsWithSOH;
            vm.allProducts = allProducts;
            vm.prescriptionDetails.createdDate = new Date(); //= vm.inPrescriptionServe ? null : new Date();
            vm.prescriptionDetails.issueDate = new Date();
            vm.age = vm.calculateAge(new Date(patient.personDto.dateOfBirth));


           console.log("State Params: ", $stateParams);

            vm.minFollowUpDate = new Date();
            vm.minFollowUpDate.setDate(vm.minFollowUpDate.getDate() + 1);

            vm.dispensingUnits = ['Capsule(s)', 'Tablet(s)', 'ml', 'mg', 'IU', 'Drop', 'Tablespoon',
                'Teaspoon', 'Unit(s)', 'Puff(s)'];
            vm.dosageFrequency = ['Immediately', 'Once a day', 'Twice a day', 'Thrice a day', 'Every hour', 'Every 2 hours', 'Every 3 hours',
                'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'On alternate days', 'Once a week', 'Twice a week',
                'Thrice a week', 'Every 2 weeks', 'Every 3 weeks', 'Once a month', '5 times a day', '4 days a week', '5 days a week', '6 days a week'];
            vm.doseRoute = ['Intramuscular', 'Intravenous', 'Oral', 'Per Vaginal', 'Sub Cutaneous', 'Per Rectum', 'Sub Lingual', 'Nasogastric',
                'Intradermal', 'Intraperitoneal', 'Intrathecal', 'Intraosseous', 'Topical', 'Nasal', 'Inhalation'];
            vm.durationUnits = ['Day(s)', 'Weeks(s)', 'Month(s)'];
            vm.instructions = ['Before meals', 'After Meals', 'Empty stomach', 'In the morning', 'In the evening', 'At bedtime', 'Immediately', 'As directed'];

        }

        vm.updateBatchOptions = function (lineItem) {

            if (lineItem.dispensedProduct) {
                // Retrieve and sort the batches by expiration date (earliest first)
                lineItem.batches = lineItem.dispensedProduct.canFulfillForMe.sort((a, b) => {
                    // Assuming expiration dates are JavaScript Date objects; if they are strings, convert them using new Date()
                    return new Date(a.lotExpirationDate) - new Date(b.lotExpirationDate);
                });
        
                // Auto-select batch if there is only one
                if (lineItem.batches.length === 1) {
                    lineItem.selectedBatch = lineItem.batches[0];
                    vm.updateBatchDetails(lineItem); // Update batch details (expiration date, stock on hand)
                } else {
                    lineItem.selectedBatch = null;
                }
            } else {
                lineItem.batches = [];
            }
        };

        // Function to update expiry date and soh
        vm.updateBatchDetails = function (lineItem) {
            
            if (lineItem.selectedBatch) {
                console.log('Selected Batch:', lineItem.selectedBatch.lotExpirationDate, lineItem.selectedBatch.stockOnHand);
            } else {
                console.log("No batch selected");
            }
        };

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

            vm.prescriptionLineItems.forEach(item => {
                item.orderableDispensed = item.dispensedProduct.orderable.id;
                item.lotId = item.selectedBatch.lot ? item.selectedBatch.lot.id : null;
                item.servedExternally = false;
                item.remainingBalance = item.quantityPrescribed - item.quantityDispensed;
                item.collectBalanceDate = null
            });

            vm.prescriptionDetails.servedByUserId = vm.user.user_id;

            confirmService.confirm("Are you sure you want to serve a prescription for " + vm.patient.personDto.firstName + " " + vm.patient.personDto.lastName + "?", "Yes")
            .then(function () {
                prescriptionsService.servePrescription(vm.prescriptionDetails).$promise
                .then(function (response) {
                    notificationService.success('Prescription Served.');
                    $state.go('openlmis.dispensing.prescriptions');
                })
                .catch(function (error) {
                    console.error('Error occurred:', error);
                });
            });
        }

        vm.createPrescrition = function () {

            if(!vm.updateMode){
                vm.prescriptionDetails.patientId = vm.patient.id;
            vm.prescriptionDetails.patientType = vm.prescriptionDetails.patientType ? "In-Patient" : "Out-Patient",
                vm.prescriptionDetails.isVoided = false;
            vm.prescriptionDetails.status = "INITIATED";
            vm.prescriptionDetails.facilityId = vm.facility.id;
            vm.prescriptionDetails.prescribedByUserId = vm.user.user_id;
            vm.prescriptionDetails.lineItems = vm.prescriptionLineItems;

            confirmService.confirm("Are you sure you want to create a prescription for " + vm.patient.personDto.firstName + " " + vm.patient.personDto.lastName + "?", "Yes")
                .then(function () {
                    prescriptionsService.createPrescription(vm.prescriptionDetails).$promise
                        .then(function (response) {
                            // Success callback
                            let prescriptionId = "";
                            for (let i = 0; i < Object.keys(response).length - 2; i++) {
                                prescriptionId += response[i];
                            }
                            notificationService.success('Prescription Created.');
                            vm.prescriptionDetails.prescriptionId = prescriptionId;
                            prescriptionsService.getPrescription(prescriptionId).$promise
                                .then(function (response) {
                                    // Success callback
                                    vm.inPrescriptionServe = true;
                                    vm.savedPrescriptionDetails = response;
                                }).catch(function (error) {
                                    // Error callback
                                    notificationService.error('Could Not get Prescription.');
                                    console.error('Error occurred:', error);

                                });
                        }
                        )
                        .catch(function (error) {
                            // Error callback
                            notificationService.error('Failed to submit.');
                            console.error('Error occurred:', error);

                        });
                });

            }
            else{
                editPrescription();
            }

            // vm.prescriptionDetails.forEach(function (item) {
            //     if(item.selectedItem.stockOnHand === null){
            //         vm.substituteProduct = true;
            //     }

            // });
        }

        vm.updatePrescription = function (){
            vm.inPrescriptionServe = false;
            vm.updateMode = true;
        }

        function editPrescription () {
            console.log(vm.prescriptionDetails);
            confirmService.confirm('Do you wish to edit this prescription?')
              .then(function () {
                prescriptionsService.updatePrescription(vm.prescriptionDetails)
                  .then(function (response) {
                    console.log(response);
                    // Success callback
                    notificationService.success('Prepacking updated Successfully');
                    $state.go('openlmis.prepacking.view');
                  })
              })
              .catch(function (error) {
                // Error callback
                notificationService.error('Failed to update ' + error + '.');
                console.error('Error occurred:', error);
    
              });
          }

        function addProduct() {

            var selectedItem = vm.selectedProduct;

            var matchingOrderable = vm.orderableGroups.find(orderableGroup => 
                orderableGroup.canFulfillForMe[0].orderableName === selectedItem.orderable.fullProductName
            );

            vm.prescriptionLineItems.unshift(

                {
                    fullProductName: selectedItem.orderable.fullProductName,
                    dose: "",
                    doseUnits: "",
                    doseFrequency: "",
                    route: "",
                    duration: "",
                    durationUnits: "",
                    additionalInstructions: "",
                    quantityPrescribed: "",
                    remainingBalance: "",
                    orderablePrescribed: selectedItem.orderable.id,
                    dispensedProduct: matchingOrderable ? matchingOrderable : null,
                    status: "REQUESTED"
                }                
            );
            if (matchingOrderable) {
                vm.updateBatchOptions(vm.prescriptionLineItems[0]); // Assumes the new line item is the first in the list
            }
        }


        vm.remove = function (index) {
            vm.prescriptionLineItems.splice(index, 1);
        };

        function substitute(lineItem) {
            vm.substituteProduct = true;
        }

    }

})();
