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
     * @name point-of-delivery-view.controller:pointOfDeliveryViewController
     *
     * @description
     * Controller for point of delivery view.
     */
    angular
        .module('point-of-delivery-view')
        .controller('pointOfDeliveryViewController', pointOfDeliveryViewController);

    pointOfDeliveryViewController.$inject = ['$stateParams', 'facility','facilities','facilityService','offlineService', 
                                            '$scope', 'PODs', 'pointOfDeliveryService','$state'];

    function pointOfDeliveryViewController($stateParams, facility,facilities,facilityService, offlineService, 
        $scope, PODs, pointOfDeliveryService,$state) {


        var vm = this;

        vm.supplyingFacilities = facilities;
        vm.$onInit = onInit;
        vm.facility = facility;
     //   vm.viewDiscrepancies = viewDiscrepancies;
        //vm.hasDiscrepancies = hasDiscrepancies;

        // vm.options = {
        //     'requisitionSearch.dateInitiated': ['createdDate,desc']
        // };

        /**
         * @ngdoc method
         * @methodOf point-of-delivery-view.controller:pointOfDeliveryViewController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {

            vm.receivingFacility = facility.name;
            vm.supplyingFacilities = facilities;        
            vm.offline = $stateParams.offline === 'true' || offlineService.isOffline();
           // vm.hasDiscrepancies = pointOfDeliveryService.submitQualityDiscrepancies();
           //var pods = PODs; 
          // console.log(pods);
        }


        /**
         * @ngdoc method
         * @methodOf point-of-delivery-view.controller:pointOfDeliveryViewController
         * @name $formatPODrecievedBy
         *
         * @description
         * Responsible for formatting 'Received By' in the view
         */     
        $scope.formatPODrecievedBy = function(name) {
            if (name) {
              var splittedName = name.split(', '); // Splitting the string by comma and space
              return splittedName.join(' '); // Joining the array elements with a space in between 
            } else {
              return ''; // Handle if input is empty or undefined
            }
          };
       
          /**
         * @ngdoc method
         * @methodOf point-of-delivery-view.controller:pointOfDeliveryViewController
         * @name getSupplyingFacilityName
         *
         * @description
         * Retrieves the name of the Supplying Facility
         */
        vm.getSupplyingFacilityName = async function(supplyingFacilityId) {
            try {
               
                var facilityObject = await facilityService.get(supplyingFacilityId);
                // Return Facility Name
                return facilityObject.name;
            } catch (error) {
                // Handle any errors that may occur during the query
                console.error("Error:", error);
                return ''; // Or handle the error appropriately
            }
        };
     
        vm.addSupplyingFacility = async function(eventPODs) {
            try {
                // Create an array of Promises
                const promises = Object.keys(eventPODs).map(async key => {
                    const singlePODEvent = eventPODs[key];
        
                    // Check whether SourceId has a value before calling
                    if (singlePODEvent.sourceId) {
                        try {
                            const resolvedObject = await vm.getSupplyingFacilityName(singlePODEvent.sourceId);
                            singlePODEvent.sourceName = resolvedObject;
                        } catch (error) {
                            // Handle errors
                            console.error('Error in controller:', error);
                        }
                    }        
                    return singlePODEvent;
                });
        
                // Await all Promises to resolve
                const eventPODsWithSupplierNames = await Promise.all(promises);
        
                return eventPODsWithSupplierNames.reduce((acc, curr, index) => {
                    acc[index] = curr;
                    return acc;
                }, {});
            } catch (error) {
                // Handle any errors that may occur during processing
                console.error('Error:', error);
                return {};
            }
        };

        
   //$scope.PODEvents = PODs; 

     // For Displaying Recieved By Name without a comma
    $scope.formatPODrecievedBy = function(name) {
        if (name) {
          var splittedName = name.split(', '); // Splitting the string by comma and space
          return splittedName.join(' '); // Joining the array elements with a space in between 
        } else {
          return ''; // Handle if input is empty or undefined
        }
    };
         
    var sendToView = pointOfDeliveryService.getPODs(facility.id);

    // Handle the promise resolution
    sendToView.then(function(resolvedObject) {
        // Assign the resolved object to a scope variable
        $scope.dataObject = vm.addSupplyingFacility(resolvedObject);
        $scope.dataObject.then(function(resolvedObject) {             
            $scope.PODEvents  = resolvedObject;     
            console.log("Resolved PODs for View:");
            console.log($scope.PODEvents);                   
        })
        .catch(function(error) {
            // Handle errors
            console.error('Error in controller:', error);
        });

    })
    .catch(function(error) {
        // Handle errors
        console.error('Error in controller:', error);
    });
    vm.viewPOD = function(id) {
        /*Function for view single POD event*/
        $state.go('openlmis.pointOfDelivery.manage', {
            podId: id,

        }); 
    }
    vm.viewDiscrepancies = function(discrepancies, referenceNumber) {
        pointOfDeliveryService.showViewModal(discrepancies, referenceNumber).then(function() {
            $stateParams.noReload = true;
            draft.$modified = true;
            vm.cacheDraft();
            //Only reload current state and avoid reloading parent state
            $state.go($state.current.name, $stateParams, {
                reload: $state.current.name
            });
        }); 
    }

        //Confirms if there are discrepancies associated with a POD.
  

        
            //Confirms if there are discrepancies associated with a POD.
        // function hasDiscrepancies(referenceNumber)
        // {
        //     console.log("In hasDiscrepancies");
        //     console.log(podAddDiscrepancyModalService.getDiscrepancies().length);
        //    // return podAddDiscrepancyModalService.getDiscrepancies() > 0 ? true:false;
        //   var output = podAddDiscrepancyModalService.getDiscrepancies().length > 0 ? true:false;
        //   console.log("Output: " + output);
        //   return output;
        // }
                
    }
})();
