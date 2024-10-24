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

    controller.$inject = ['$state', 'prescriptionsService', 'allProducts', '$stateParams', 'user', 'patient',
        'prescription', 'facility', 'confirmService', 'notificationService', 'productsWithSOH', 'stockCardProducts', 'lotService'];

    function controller($state, prescriptionsService, allProducts, $stateParams, user, patient,
        prescription, facility, confirmService, notificationService, productsWithSOH, stockCardProducts, lotService) {

        var vm = this;


        vm.$onInit = onInit;
        vm.servePrescription = servePrescription;
        vm.addProduct = addProduct;
        vm.substitute = substitute;
        vm.getLots = getLots;
        // vm.editPrescription = editPrescription;
        vm.setPrescription = setPrescription;
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
        vm.allProducts = undefined;

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
            vm.allStockCardCommodities = productsWithSOH; // All products (UUIDs ONLY) with stock cards within the facility
            vm.allProducts = allProducts; // All facility approved products
            vm.prescriptionDetails.createdDate = new Date(); //= vm.inPrescriptionServe ? null : new Date();
            vm.prescriptionDetails.issueDate = new Date();
            vm.age = vm.calculateAge(new Date(patient.personDto.dateOfBirth));

            $stateParams.update ? setPrescription() : '';
            vm.updateMode = $stateParams.update;

            if (prescription && prescription.status === 'INITIATED') {
                vm.updateMode = false;
            }

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

        function setPrescription() {
            prescriptionsService.getPrescription($stateParams.prescriptionId).$promise
                .then(function (response) {

                    vm.inPrescriptionServe = true;
                    vm.prescriptionDetails = response;
                    vm.prescriptionDetails.prescriptionId = response.id;
                    vm.prescriptionLineItems = response.lineItems;
                    vm.prescriptionDetails.patientType = vm.prescriptionDetails.patientType === "Inpatient";
                    vm.prescriptionLineItems.forEach(item => {
                        item.fullProductName = item.orderablePrescribedName;
                        item.dispensedProduct = item.orderableDispensedName;
                        item.selectedBatch = item.lotCode;
                        item.instructions = item.additionalInstructions;
                    });
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

            if ($stateParams.update) {
                vm.prescriptionLineItems.forEach(item => {
                    item.orderableDispensed = item.orderableDispensed;
                    item.lotId = item.lotId || null;
                    item.servedExternally = item.servedExternally;
                    item.remainingBalance = item.quantityPrescribed - item.quantityDispensed;
                    item.collectBalanceDate = null
                });
            } else {
                vm.prescriptionLineItems.forEach(item => {
                   
                    item.orderableDispensed = item.dispensedProduct.orderable.id;
                    item.lotId = item.selectedBatch.lot ? item.selectedBatch.lot.id : null;
                    item.servedExternally = false;
                    item.remainingBalance = item.quantityPrescribed - item.quantityDispensed;
                    item.collectBalanceDate = null
                });
            }
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

            // if(!vm.updateMode){
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
                                    //console.log("Created Prescription ", response);
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



            // }
            // else{
            //     editPrescription();
            // }

            // vm.prescriptionDetails.forEach(function (item) {
            //     if(item.selectedItem.stockOnHand === null){
            //         vm.substituteProduct = true;
            //     }

            // });
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

        // function editPrescription () {
        //     console.log(vm.prescriptionDetails);
        //     confirmService.confirm('Do you wish to edit this prescription?')
        //       .then(function () {
        //         prescriptionsService.updatePrescription(vm.prescriptionDetails)
        //           .then(function (response) {
        //             console.log(response);
        //             // Success callback
        //             notificationService.success('Prepacking updated Successfully');
        //             $state.go('openlmis.prepacking.view');
        //           })
        //       })
        //       .catch(function (error) {
        //         // Error callback
        //         notificationService.error('Failed to update ' + error + '.');
        //         console.error('Error occurred:', error);

        //       });
        //   }

        function addProduct() {

            var selectedItem = vm.selectedProduct;

            var matchingOrderable = vm.allStockCardCommodities.find(product =>
                product.canFulfillForMe[0].orderableName === selectedItem.orderable.fullProductName
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
                vm.updateBatchOptions(vm.prescriptionLineItems[0]);
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
