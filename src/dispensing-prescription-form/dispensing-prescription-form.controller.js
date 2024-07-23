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
     * @name dispensing-prescription-form.controller:dispensingPrescriptionFormController
     *
     * @description
     * Controller for managing prescription list screen.
     */
    angular
        .module('dispensing-prescription-form')
        .controller('dispensingPrescriptionFormController', controller);

        controller.$inject = ['prescriptionsService', 'prepackingService', '$stateParams' ];

    function controller(prescriptionsService, prepackingService, $stateParams) {

        var vm = this;

        // vm.resetPatientPassword = resetPatientPassword;
        // vm.search = search;
        vm.$onInit = onInit;
        vm.submitPrescription = submitPrescription;
        vm.addProduct = addProduct;
        vm.addContact = addContact;
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

            vm.patientId = 
            console.log(vm.patientId);
           
            vm.dispensingUnits = ['Capsule(s)', 'Tablet(s)', 'ml', 'mg', 'IU', 'Drop', 'Tablespoon', 
                                    'Teaspoon', 'Unit(s)', 'Puff(s)'];
            vm.dosageFrequency = ['Immediately', '>Once a day', 'Twice a day', 'Thrice a day', 'Every hour', 'Every 2 hours', 'Every 3 hours', 
                        'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'On alternate days', 'Once a week', 'Twice a week', 
                        'Thrice a week', 'Every 2 weeks', 'Every 3 weeks', 'Once a month', '5 times a day', '4 days a week', '5 days a week', '6 days a week'];
            vm.doseRoute = ['Intramuscular', 'Intravenous', 'Oral', 'Per Vaginal', 'Sub Cutaneous', 'Per Rectum', 'Sub Lingual', 'Nasogastric', 
                        'Intradermal', 'Intraperitoneal', 'Intrathecal', 'Intraosseous', 'Topical', 'Nasal', 'Inhalation'];
            vm.durationUnits =['Day(s)', 'Weeks(s)', 'Month(s)'];
            vm.instructions = ['Before meals', 'Empty stomach', 'In the morning', 'In the evening', 'At bedtime', 'Immediately', 'As directed'];
         
            vm.Products =  [
                {
                    "orderable": {
                        "id": "e02be3ba-8ad5-4ad5-a5bd-713c2eac065a",
                        "productCode": "DON001-ALC004-CON008-200",
                        "fullProductName": "Alcohol Swabs Consumable 200",
                        "description": "Alcohol Swabs Consumable 200",
                        "netContent": 200
                    },
                    "lot": null,
                    "stockOnHand": 303
                },   
                {
                    "orderable": {
                        "id": "8d6251a4-5e19-4b5f-af30-c7b5ce1c51cb",
                        "productCode": "DON-APT025-REA001-1",
                        "fullProductName": "APTIMA  DBS EXTRACTION BUFFER Reagent 1",
                        "description": "APTIMA  DBS EXTRACTION BUFFER Reagent 1",
                        "netContent": 1
                    },                
                    "lot": null,
                    "stockOnHand": 3
                },
                {
                    "orderable": {
                        "id": "96257977-67dd-4ff1-84bc-eb05639234fe",
                        "productCode": "DON-ABA005-TAB001-60",
                        "fullProductName": "Abacavir/Lamivudine 120/60 Scored Dispersible Tablets 60",
                        "description": "Abacavir/Lamivudine 120/60 Scored Dispersible Tablets 60",
                        "netContent": 60
                    },
                    "lot": "Batch3333",
                    "stockOnHand": 400
                },
                {
                    "orderable": {
                        "id": "69004775-e8f1-4c13-b9df-aaa03b86104d",
                        "productCode": "DON-ABA005-TAB001-60-20",
                        "fullProductName": "Abacavir/Lamivudine 120/60 Scored Dispersible Tablets 60-20",
                        "description": "Abacavir/Lamivudine 120/60 Scored Dispersible Tablets 60-20",
                        "netContent": 20
                    },
                    "lot": "Batch3333-20",
                    "stockOnHand": 40
                }
            ];
            console.log(prescriptionsService.getPrescription());
            console.log(prescriptionsService.getPrescriptions());
        }

        function submitPrescription(){
            console.log("CREATING PRESCRIPTION");
            console.log(vm.prescriptionDetails);
            return prescriptionsService.createPrescription(vm.prescriptionDetails).then(function(response){
                console.log(response);
             });
        }


        function addProduct() {
            vm.prescriptionDetails.unshift(
                _.extend(
                    {   orderableId: vm.selectedProduct.orderable.id,
                        //"substituteOrderableId": "dbaa07c0-66cd-43ed-9272-1d0d8ae7844a",
                        //"exiryDate" "",
                        prescribedProduct: vm.selectedProduct.orderable.fullProductName,
                        batchNumber: vm.selectedProduct.lot ? vm.selectedProduct.lot : null
                    })
            );
            console.log(vm.prescriptionDetails);
        }

        vm.remove = function (lineItem) {
            var index = vm.prescriptionDetails.indexOf(lineItem);
            vm.prescriptionDetails.splice(index, 1);
        };

        function addContact() {
            console.log("Add line item...");
            vm.contacts.push({
                'phone': '',
                'email': ''
            });
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
