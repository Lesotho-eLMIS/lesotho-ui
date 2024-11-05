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
     * @name dispensing-prescriptions-serve.controller:dispensingPrescriptionsServeController
     *
     * @description
     * Controller for serving prescriptions.
     */
    angular
        .module('dispensing-prescriptions-serve')
        .controller('dispensingPrescriptionsServeController', controller);

    controller.$inject = ['$state', 'prescriptionsService', '$stateParams', 'user', 'patient',
        'prescription', 'facility', 'confirmService', 'notificationService', 'productsWithSOH', 'stockCardProducts', 'lotService'];

    function controller($state, prescriptionsService, $stateParams, user, patient,
        prescription, facility, confirmService, notificationService, productsWithSOH, stockCardProducts, lotService) {

        var vm = this;


        vm.$onInit = onInit;
        vm.servePrescription = servePrescription;
        vm.getLots = getLots;
        vm.setPrescription = setPrescription;
        vm.isUpdate = isUpdate;
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

        vm.allStockCardCommodities = undefined;
        // vm.orderables = undefined;
        vm.lots = undefined;
       // vm.allProducts = undefined;

        /**
         * @ngdoc method
         * @methodOf dispensing-prescriptions.controller:dispensingPrescriptionsController
         * @name onInit
         *
         * @description
         * Method that is executed on initiating dispensingPrescriptionsController.
         */
        function onInit() {

           // console.log("Serving Ctrl: ", $stateParams);
            vm.inPrescriptionServe = true;
            vm.patient = patient;        
           // console.log("Patient: ", vm.patient);
            vm.facility = facility;
            vm.user = user;
            vm.prescriptionDetails = prescription;
            // console.log("Prescription: ", vm.prescriptionDetails);
            vm.prescriptionLineItems = vm.prescriptionDetails.lineItems;
            vm.prescriptionDetails.patientType = vm.prescriptionDetails.patientType === "In-Patient";
            vm.allStockCardCommodities = productsWithSOH; 
            vm.age = vm.calculateAge(new Date(patient.personDto.dateOfBirth));
            vm.updateMode = isUpdate(); 
            vm.updateMode ? setPrescription() : '';

            vm.minFollowUpDate = new Date();
            vm.minFollowUpDate.setDate(vm.minFollowUpDate.getDate() + 1);

            vm.dispensingUnits = ['Capsule(s)', 'Tablet(s)', 'ml', 'mg', 'g', 'MU', 'IU', 'Drop', 'Tablespoon',
                'Teaspoon', 'Unit(s)', 'Puff(s)'];
            vm.dosageFrequency = ['PRN (As Needed)', 'Nocte (At Night)', 'Immediately', 'Once a day', 'Twice a day', 'Thrice a day', '5 times a day', 'On alternate days', 'Every hour', 'Every 2 hours', 'Every 3 hours',
                'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'Once a week', 'Twice a week',
                'Thrice a week', 'Every 2 weeks', 'Every 3 weeks', '4 days a week', '5 days a week', '6 days a week', 'Once a month', 'Once in 2 months', 'Once in 3 months'];
            vm.doseRoute = ['Intramuscular', 'Intravenous', 'Oral', 'Per Vaginal', 'Sub Cutaneous', 'Per Rectum', 'Sub Lingual', 'Nasogastric',
                'Intradermal', 'Intraperitoneal', 'Intrathecal', 'Intraosseous', 'Topical', 'Nasal', 'Inhalation'];
            vm.durationUnits = ['Day(s)', 'Weeks(s)', 'Month(s)'];
            vm.instructions = ['Before meals', 'After Meals', 'Empty stomach', 'In the morning', 'In the evening', 'At bedtime', 'Immediately', 'As directed'];

        }

        function getLots(lineItem) {

            var lots = [];
            if (lineItem && lineItem.dispensedProduct && Array.isArray(lineItem.dispensedProduct.canFulfillForMe)) {
                lineItem.dispensedProduct.canFulfillForMe.forEach(item => {
                    if (item.lot && item.lot.id) {
                        lots.push(item.lot.id);
                    }
                });

                return lotService.query({ id: lots })
                    .then(result => {
                        lineItem.dispensedProduct.canFulfillForMe.forEach(function (item) {
                            if (item.lot) {
                                var getLot = result.content.find(lot => item.lot.id === lot.id);
                                item.orderableLotCode = getLot ? getLot.lotCode : null;
                                item.expirationDate = getLot ? getLot.expirationDate : null;
                            }
                        });
                        return result.content;
                    });
            } else {
                // Handle the case where canFulfillForMe is undefined or not an array
                console.error("Invalid lineItem structure or canFulfillForMe is not an array.");
                return Promise.reject("Invalid lineItem structure.");
            }
        }

        function isUpdate(){
            return vm.prescriptionDetails.status === "PARTIALLY_SERVED";
        }

        

        function setPrescription() {
            // console.log("Updating");

            vm.prescriptionLineItems.forEach(item => {
                //  item.fullProductName = item.orderablePrescribedName;
                item.dispensedProduct = item.orderableDispensedName;
                item.selectedBatch = item.lotCode;
                item.instructions = item.additionalInstructions;
            });

        }


        vm.updateBatchOptions = function (lineItem) {

            getLots(lineItem);

            if (lineItem.dispensedProduct) {
                // Retrieve and sort the batches by expiration date (earliest first)
                lineItem.batches = lineItem.dispensedProduct.canFulfillForMe.sort((a, b) => {
                    return new Date(a.expirationDate) - new Date(b.expirationDate);
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
                lineItem.lotCode = lineItem.selectedBatch.orderableLotCode;
                lineItem.lotId = lineItem.selectedBatch.lot.id;
                lineItem.orderableDispensed = lineItem.selectedBatch.orderable.id;
                lineItem.orderableDispensedName = lineItem.dispensedProductName;
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

            // console.log("Prescription Items: ", vm.prescriptionLineItems);            

            if (vm.updateMode) {
                vm.prescriptionLineItems.forEach(item => {
                    item.orderableDispensed = item.orderableDispensed;
                    item.lotId = item.lotId || null;
                    item.servedExternally = item.servedExternally;
                    item.remainingBalance = item.quantityPrescribed - item.quantityDispensed;
                    item.collectBalanceDate = null
                  //  item.lastUpdate = new Date();
                });
            } else {
                vm.prescriptionLineItems.forEach(item => {
                   
                    item.orderableDispensed = item.dispensedProduct.orderable.id;
                    item.lotId = item.selectedBatch.lot ? item.selectedBatch.lot.id : null;
                    item.servedExternally = item.servedExternally;
                    item.remainingBalance = item.quantityPrescribed - item.quantityDispensed;
                    item.collectBalanceDate = null
                   // item.lastUpdate = new Date();
                });
            }
            vm.prescriptionDetails.patientType = vm.prescriptionDetails.patientType ? "In-Patient" : "Out-Patient";
            vm.prescriptionDetails.servedByUserId = vm.user.user_id;
            vm.prescriptionDetails.lineItems = vm.prescriptionLineItems;
            vm.prescriptionDetails.lastUpdate = new Date();
            // console.log("Serving Prescription Details: ", vm.prescriptionDetails);

            confirmService.confirm("Are you sure you want to serve a prescription for " + vm.patient.personDto.firstName + " " + vm.patient.personDto.lastName + "?", "Yes")
                .then(function () {
                    prescriptionsService.servePrescription(vm.prescriptionDetails).$promise
                        .then(function (response) {
                            notificationService.success('Prescription Served.');
                            $state.go('openlmis.dispensing.prescriptions',{}, {
                                reload: true
                            });
                        })
                        .catch(function (error) {
                            console.error('Error occurred:', error);
                        });
                });
        }

       
        vm.updatePrescription = function () {
            console.log("Updating Prescription");
            console.log(vm.prescriptionDetails);

            confirmService.confirm("Are you sure you want to update this prescription for " + vm.patient.personDto.firstName + " " + vm.patient.personDto.lastName + "", "Yes")
                .then(function () {
                    prescriptionsService.updatePrescription(vm.prescriptionDetails)
                        .then(function (response) {
                            notificationService.success('Prescription updated Successfully.');
                            // $state.go('openlmis.dispensing.prescriptions');
                            console.log("Updated Prescription", response);
                            $state.go('openlmis.dispensing.view', {
                                prescriptionId: response.id,
                                patientId: response.patientId
                            });
                        })
                        .catch(function (error) {
                            console.error('Error occurred:', error);

                        });
                });
        }
    }

})();
