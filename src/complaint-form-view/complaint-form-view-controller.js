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
     * @name complaint-form-view.controller:complaintFormViewController
     *
     * @description
     * Manages View of Complaints.
     */
    angular
        .module('complaint-form-view')
        .controller('complaintFormViewController', controller);

    controller.$inject = ['facility', 'complaints', 'lotService'];

    function controller(facility, complaints, lotService) {
        var vm = this;

        vm.getComplaints = getComplaints;
        vm.getLots = getLots;
        vm.getLineItemDetails = getLineItemDetails;

        vm.facility = facility;
        vm.complaints = complaints;
        

        /**
         * @ngdoc property
         * @propertyOf complaint-form-view.controller:complaintFormViewController
         * @name lineItems
         * @type {Array}
         *
         * @description
         * The list of requesting complaint form line items.
         */
        vm.lineItems = undefined;

        vm.$onInit = onInit;

        function onInit() {
            vm.facilityName = vm.facility.name;
        }

        
        /**
         * @ngdoc method
         * @methodOf complaint-form-view.controller:complaintFormViewController
         * @name viewComplaints
         *
         * @description
         * Gets the line items of a complaint form.
         *
         * @param {String} UUID of complaint record to get line items from
         * @return {Array} array of complaint line items
         */
        function getComplaints(itemId) {
            vm.lineItems = vm.complaints.find(item => itemId === item.id).lineItems;
            getLots(vm.lineItems);
        }

        function getLineItemDetails(lineItems) {
            var promises = lineItems.map(lineItem => {
                getLots(lineItem.lotId).then(response => {
                    lineItem.lotCode = response.content[0].lotCode
                });
            });
            Promise.all(promises).then(() => {
            });
        }

        
        function getLots(lineItems) {

            var promises = lineItems.map(lineItem => {
                var params = { id: lineItem.lotId };
                lotService.query(params).then(response => {
                    lineItem.lotCode = response.content[0].lotCode;
                })
            });
            Promise.all(promises).then(() => {
                lineItems;
                console.log("New Line Items: ", lineItems);
            });
        }
    
    }
})();