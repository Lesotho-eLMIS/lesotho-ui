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
        vm.changePrepackStatus = changePrepackStatus;  
        vm.prepack = undefined;
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
        function changePrepackStatus(newStatus) {
            vm.prepack.status = newStatus;
           
            var buttonContext = "";
            var questionContext = "";
            var successMsgContext = "";

            if(newStatus === "Authorised"){
                buttonContext = "Authorise";
                questionContext = "authorise";
                successMsgContext = "authorised"
            }else if(newStatus === "Cancelled"){
                buttonContext = "Cancel";
                questionContext = "cancel";
                successMsgContext = "cancelled"
            }else if(newStatus === "Rejected"){
                buttonContext = "Reject";
                questionContext = "reject";
                successMsgContext = "rejected"
            }
            else{
                notificationService.error('Unknown Prepack Status Detected.');
                console.error("Unknown Prepack Status Detected");
            }
            confirmService
                .confirm("Are you sure you want to "+questionContext+" this prepacking job?", buttonContext)
                .then(function () {
                   prepackingService.updatePrepacks(vm.prepack.id, vm.prepack)
                  .then(function(response) {
                    // Success callback
                    notificationService.success('Prepacking job '+successMsgContext+'.');
                    $state.go('openlmis.prepacking.view');
                    }
                  )
                  .catch(function(error) {
                      // Error callback
                      notificationService.error('Failed to '+questionContext+'.');
                      console.error('Error occurred:', error);
                  
                  });
                });
    
        }

        function getLineItemsDetails(){

            var productsArray = _.flatten(vm.productInfo);            
          //  var haslots = undefined;
            console.log("PREPACK LINE ITEMS");
            console.log(vm.prepackLineItems);
            console.log("PRODUCT ITEMS");
            console.log(productsArray);
            vm.prepackLineItems.forEach(item => {
                //item.lotId === null ? haslots = true: haslots = false;              
                var productDetails = prepackingService.filterProductByLot(productsArray, item);
                // .find(lineItem => ((lineItem.orderable.id === item.orderableId
                //             && lineItem.lot.id === item.lotId))); 
                console.log("GET LINE ITEMS");
                console.log(productDetails);
                item.productName = productDetails[0].orderable.fullProductName;
                item.productCode = productDetails[0].orderable.productCode;
                item.batchNumber = productDetails[0].lot.lotCode;
                item.expiryDate = productDetails[0].lot.expirationDate;
                item.soh = productDetails[0].stockOnHand;
                item.remainingStock = prepackingService.prepackCalculation(vm.prepackLineItems, item);
            });         
            return(vm.prepackLineItems);  
        }

    }
})()