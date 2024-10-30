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
     * @name dispensing-patient-vitals-modal.controller:dispensingPatientVitalsModalController
     *
     * @description
     * Manages Add Discrepancy Modal.
     */
    angular
        .module('dispensing-patient-vitals-modal')
        .controller('dispensingPatientVitalsModalController', controller);

    controller.$inject = [ 'modalDeferred', '$scope', 'patient', 'notificationService', 'messageService', 'complaintService', 'confirmService'];

    function controller( modalDeferred, $scope, patient, notificationService, messageService, complaintService, confirmService) {//
        
        var vm = this;

        vm.$onInit = onInit;

        vm.patient = patient;

        $scope.showModal=false;
        
        function onInit() {
            vm.age = vm.calculateAge(new Date(patient.personDto.dateOfBirth));
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

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name orderableSelectionChanged
         *
         * @description
         * Reset form status and change content inside lots drop down list.
         */
        
        function confirm (){
            vm.complaint.lineItems = vm.productsForComplaint; // Add complaint payload lineitems
            confirmService
            .confirm("Are you sure you want to send complaint?", "Send")
            .then(function () {
               complaintService.saveComplaint(vm.complaint).$promise
              .then(function(response) {
                // Success callback
                let complaintId = "";
                for (let i = 0; i < Object.keys(response).length-2; i++) {
                    complaintId += response[i];
                }
                notificationService.success('Complaint Saved Sucessfully.');
                complaintService.sendComplaint(complaintId, vm.complaint).$promise
                    .then(function(sendReponse) {
                        notificationService.success('Complaint Sent Sucessfully.');
                    });
                
                modalDeferred.resolve();
                }
              )
              .catch(function(error) {
                  // Error callback
                  notificationService.error('Failed to submit.');
                  console.error('Error occurred:', error);
              
              });
            });
        }
    }
})();
