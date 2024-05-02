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
     * @name prepacking-details.controller:prepackingDetailsController
     *
     * @description
     * Controller for managing prepack Details Viewhd.
     */
    angular
      .module('prepacking-details')
      .controller('prepackingDetailsController', prepackingDetailsController);
  
      prepackingDetailsController.$inject = ['facility', 'user', 'programs', 'prepack', 'products','$state', 'prepackingService', 'notificationService', 'confirmService', 'messageService'];

    function prepackingDetailsController(facility, user, programs,  prepack, products, $state, prepackingService,notificationService, confirmService, messageService){
        var vm = this;

        vm.onInit = onInit;
        vm.prepackLineItems = [];
        vm.getLineItemsDetails = getLineItemsDetails;
        vm.filterProductByLot = filterProductByLot;
        vm.authorisePrepack = authorisePrepack;
        vm.prepack = undefined;
        
        function onInit(){
            vm.facility = facility;            
            vm.user = user;
            vm.prepack = prepack;
            vm.programs = programs;
            vm.prepackLineItems = prepack.lineItems;
            vm.productInfo = products;
            vm.prepackedProducts = getLineItemsDetails();
        }

        onInit();

        function authorisePrepack() {
            vm.prepack.status = "Authorised";
            confirmService
                .confirm("Are you sure you want to authorise this prepacking job?", "Authorise")
                .then(function () {
                   prepackingService.updatePrepacks(vm.prepack.id, vm.prepack)
                  .then(function(response) {
                    // Success callback
                    notificationService.success('Prepacking job authorised.');
                    $state.go('openlmis.prepacking.view');
                    }
                  )
                  .catch(function(error) {
                      // Error callback
                      notificationService.error('Failed to Authorise.');
                      console.error('Error occurred:', error);
                  
                  });
                });
    
        }

        function getLineItemsDetails(){

            var productsArray = _.flatten(vm.productInfo);            
            var haslots = undefined;
            vm.prepackLineItems.forEach(item => {
                
                item.lotId === null ? haslots = true: haslots = false;              
                var productDetails = filterProductByLot(productsArray, haslots).find(lineItem => ((lineItem.orderable.id === item.orderableId
                            && lineItem.lot.id === item.lotId))); 
                item.productName = productDetails.orderable.fullProductName;
                item.productCode = productDetails.orderable.productCode;
                item.batchNumber = productDetails.lot.lotCode;
                item.expiryDate = productDetails.lot.expirationDate;
                item.soh = productDetails.stockOnHand;
            });             
            return(vm.prepackLineItems);  
        }

        function filterProductByLot (productsList, lotIsNull){

            if(!lotIsNull)
            {
                return productsList.filter(item => !(item.lot === null));
            }
            else{
                return productsList.filter(item => item.lot === null);
            }
        }

        

    }
})()