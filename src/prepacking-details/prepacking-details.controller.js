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
      //  vm.filterProductByLot = filterProductByLot;
       // vm.changePrepackStatus = changePrepackStatus;  
        vm.prepack = undefined;
        vm.authorizePrepack = authorizePrepack;
        vm.deletePrepack = deletePrepack;
      //  vm.calculateRemainingStock = calculateRemainingStock;
        
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
      
      function authorizePrepack() {
        console.log(vm.prepack);
        confirmService.confirm('Do you wish to confirm the adjustments?')
          .then(function () {
            prepackingService.authorizePrepack(vm.prepack.id)
              .then(function (response) {
                console.log(response);
                // Success callback
                notificationService.success('Prepacking Authorised Successfully');
                $state.go('openlmis.prepacking.view');
              })
              .catch(function (error) {
                // Error callback
                notificationService.error('Failed to Authorise ' + error + '.');
                console.error('Error occurred:', error);
    
              });
          })
      }

      function deletePrepack() {
        console.log('Deleting');
        prepackingService.deletePrepack(vm.prepack.id)
          .then(function (response) {
            console.log('Prepacking event deleted successfully', response);
          })
          .catch(function (error) {
            console.error('Error deleting prepacking event', error);
          });
      }

        function getLineItemsDetails(){

          console.log("Working towards viewing details for this prepack");
          console.log(vm.prepackLineItems);

            var productsArray = _.flatten(vm.productInfo);   
            console.log(productsArray);
            vm.prepackLineItems.forEach(item => {           
                var productDetails = prepackingService.filterProductByLot(productsArray, item);
                console.log(productDetails);
                item.productName = productDetails[0].orderable.fullProductName;
                item.productCode = productDetails[0].orderable.productCode;
                item.batchNumber = productDetails[0].lot? productDetails[0].lot.lotCode : null;
                item.expiryDate = productDetails[0].expirationDate? productDetails[0].lot.expirationDate : null;
                item.soh = productDetails[0].stockOnHand;
                item.remainingStock = prepackingService.calculateRemainingStock(vm.prepackLineItems, item);
            });         
            return(vm.prepackLineItems);  
        }

        vm.isAuthorised = function(){
          if(vm.prepack.status === 'AUTHORIZED'){
            return true;
          }
          return false;
        }

        vm.updatePrepack = function(){
          console.log(vm.prepack);
          $state.go('openlmis.stockmanagement.prepack.update', {
            prepackId: vm.prepack.id,
            programId: vm.prepack.programId,
            facilityId: vm.facility.id
          });
        }

    }
})()