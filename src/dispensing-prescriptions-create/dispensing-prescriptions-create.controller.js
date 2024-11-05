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
     * @name dispensing-prescriptions-create.controller:dispensingPrescriptionsCreateController
     *
     * @description
     * Controller for creating prescriptions.
     */
    angular
        .module('dispensing-prescriptions-create')
        .controller('dispensingPrescriptionsCreateController', controller);

    controller.$inject = ['$state', 'prescriptionsService', 'allProducts2', '$stateParams', 'user', 'patient',
        'facility', 'confirmService', 'notificationService'];

    function controller($state, prescriptionsService, allProducts2,  $stateParams, user, patient,
        facility, confirmService, notificationService) {

        var vm = this;


        vm.$onInit = onInit;
        vm.addProduct = addProduct;
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
            vm.allProducts = allProducts2.content; // All orderables
            vm.prescriptionDetails.createdDate = new Date(); //= vm.inPrescriptionServe ? null : new Date();
            vm.prescriptionDetails.issueDate = new Date();
            vm.age = vm.calculateAge(new Date(patient.personDto.dateOfBirth));
            vm.updateMode = false;
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

        vm.createPrescrition = function () {

            vm.prescriptionDetails.patientId = vm.patient.id;
                                                                
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
                            // $state.go('openlmis.dispensing.prescriptions',{}, {
                            //     reload: true
                            // });
                            $state.go('openlmis.dispensing.prescriptions.serve', {
                                prescriptionId: prescriptionId,
                                patientId: vm.patient.id
                            });
                        })
                        .catch(function (error) {
                            // Error callback
                            notificationService.error('Failed to submit.');
                            console.error('Error occurred:', error);

                        });
                });
        }

        function addProduct() {

            var selectedItem = vm.selectedProduct;
            console.log(selectedItem);
            // var matchingOrderable = vm.allStockCardCommodities.find(product =>
            //     product.canFulfillForMe[0].orderableName === selectedItem.fullProductName
            // );

            vm.prescriptionLineItems.unshift(

                {
                    fullProductName: selectedItem.fullProductName,
                    dose: "",
                    doseUnits: "",
                    doseFrequency: "",
                    route: "",
                    duration: "",
                    durationUnits: "",
                    additionalInstructions: "",
                    quantityPrescribed: "",
                    remainingBalance: "",
                    orderablePrescribed: selectedItem.id,
                    dispensedProduct: null,
                    status: "REQUESTED"
                }
            );
            // if (matchingOrderable) {
            //     vm.updateBatchOptions(vm.prescriptionLineItems[0]);
            // }
        }


        vm.remove = function (index) {
            vm.prescriptionLineItems.splice(index, 1);
        };

    }

})();
