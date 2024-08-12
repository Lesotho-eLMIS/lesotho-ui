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
     * @name dispensing-prescription-view.controller:dispensingPrescriptionView
     *
     * @description
     * Exposes method for creating/updating prescription to the modal view.
     */
    angular
        .module('dispensing-prescription-view')
        .controller('dispensingPrescriptionView', controller);

    controller.$inject = ['$filter', '$state', '$stateParams', 'Prescription', 'Products'];

    function controller($filter, $state, $stateParams, Prescription, Products) {

        var vm = this;

        vm.$onInit = onInit;
        vm.getProductDetails = getProductDetails;
        vm.prescription = undefined;
        vm.prescriptionLineItems = undefined;
        vm.dispensableProducts = undefined;

        /**
         * @ngdoc method
         * @methodOf dispensing-prescription-view.controller:dispensingPrescriptionView
         * @name $onInit
         *
         * @description
         * Initialization method of the dispensingPrescriptionView.
         */
        function onInit() {

            vm.prescription = Prescription;
            vm.prescriptionLineItems = Prescription.lineItems;
            vm.dispensableProducts = Products.content;
            console.log("Prescription", vm.prescription);
            console.log("State Params", $stateParams)
            console.log("Products", vm.dispensableProducts);
            var temp = getProductDetails(vm.prescriptionLineItems, vm.dispensableProducts);
            console.log(temp);
        }

        function getProductDetails(lineItems, products) {
            // Iterate over each line item in the prescription

            return lineItems.map(lineItem => {
                // Find the corresponding product in the products array
                const product = products.find(prod => prod.orderable.id === lineItem.orderablePrescribed);
            
                console.log("PRODUCT", product);
            
                if (product) {
                    // Map batches from the product's 'canFulfillForMe' array
                    const batches = product.canFulfillForMe.map(batch => ({
                        orderableName: batch.orderableName,
                        lotId: batch.lot ? batch.lot.id : null,
                        lotCode: batch.lot ? batch.lot.lotCode : 'No Batch',  // Handle case where lot or lotCode is null
                        stockOnHand: batch.stockOnHand,
                        lotExpirationDate: batch.lot ? batch.lot.lotExpirationDate : 'N/A' // Handle case where lotExpirationDate is null
                    }));

                    console.log("Batches", batches);
            
                    let selectedBatch = undefined;
                    if (batches.length > 1) {
                        const matchedBatches = batches.filter(batch => batch.lotId === lineItem.lotId);
                        selectedBatch = matchedBatches.length > 0 ? matchedBatches[0] : null;
                    } else {
                        selectedBatch = batches[0];
                    }
            
                    if (selectedBatch) {
                        // Create the prescribedProduct object
                        lineItem.prescribedProduct = product.canFulfillForMe[0].orderableName; //selectedBatch.orderableName;
                        lineItem.batchNumber = selectedBatch.lotCode;
                        lineItem.expiryDate = selectedBatch.lotExpirationDate;
                        lineItem.dosePeriod = lineItem.duration + " " + lineItem.durationUnits;

                        // return {
                        //     //orderableId: lineItem.orderablePrescribed;
                        //     lineItem.productName: selectedBatch.orderableName; // Assuming all batches share the same orderableName
                        //     lineItem.batchName = selectedBatch.lotCode;
                        //     expiryDate: selectedBatch.lotExpirationDate 
                        // };
                        console.log(lineItem);
                    } else {
                        // If no matching batch is found, return null or handle as needed
                        return null;
                    }
                } else {
                    // If no corresponding product is found, return null 
                    return null;
                }
            });
            


            // return lineItems.map(lineItem => {
            //     // Find the corresponding product in the products array
            //     const product = products.find(prod => prod.orderable.id === lineItem.orderablePrescribed
            //     );

            //     console.log("PRODUCT", product);

            //     if (product) {
            //         // Map batches from the product's 'canFulfillForMe' array
            //         const batches = product.canFulfillForMe.map(batch => ({
            //             orderableName: batch.orderableName,
            //             lotId: batch.lot ? batch.lot.id : null,
            //             lotCode: batch.lot ? batch.lot.lotCode : 'No Batch',  // Handle case where lot or lotCode is null
            //             stockOnHand: batch.stockOnHand,
            //             lotExpirationDate: batch.lot ? batch.lot.lotExpirationDate : 'N/A' // Handle case where lotExpirationDate is null
            //         }));
            //         var batch = undefined;
            //         if(batches.length > 1){
            //             // var batch = batches.filter(batch.lot.id === lineItem.lotId);
            //             batch = batches.filter(batch => batch.lot && batch.lotId === lineItem.lotId);
            
            //         }else{
            //             batch = batches[0];
            //         }

            //         // Create the prescribedProduct object
            //         return {
            //             orderableId: lineItem.orderablePrescribed,
            //             productName: batch[0].orderableName, //batches[0].orderableName, // Assuming all batches share the same orderableName
            //             batchName: batch[0].lotCode, 
            //             expiryDate: batch[0].lotExpirationDate 
            //         };
            //     } else {
            //         // If no corresponding product is found, return null 
            //         return null;
            //     }
            // });
        }
        
    }
})();
