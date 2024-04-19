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
     * @name prepacking-view.controller:prepackingViewController
     *
     * @description
     * Controller for managing stock adjustment creation.
     */
    angular
      .module('prepacking-view')
      .controller('prepackingViewController', controller);
  
    controller.$inject = ['facility', 'user', 'programs', 'prepackingService', 'Prepacks', 'facilityService', '$state'];

    function controller(facility, user, programs, prepackingService, Prepacks, facilityService, $state){
        var vm = this;
       // vm.facility = undefined;

        vm.onInit = onInit;
        vm.prepackLineItems = [];
        vm.formatPrepacks = formatPrepacks;
        vm.getFacilityName = getFacilityName;
        vm.getProgramName = getProgramName;
        
        function onInit(){
            vm.facility = facility;            
            vm.user = user;
            vm.programs = programs;
            vm.prepackLineItems = Prepacks;
            formatPrepacks();
        }
        onInit();

        //Returns the Name of the facility
       function getFacilityName(facilityId) {
            return facilityService.get(facilityId)
                .then(function(facilityObject) {
                    var facilityName = facilityObject.name;
                    return facilityName ;
                })
                .catch(function(error) {
                    // Handle any errors that may occur during the query
                    console.error("Error:", error);
                    return ""; // Or handle the error appropriately
                });
        };

       function getProgramName(programId){
            let program = programs.find(item => item.id === programId);
            return program.name;
        }
   

        function formatPrepacks() {
            for (let key in vm.prepackLineItems) {
                if (vm.prepackLineItems.hasOwnProperty(key)) {
                    const pack = vm.prepackLineItems[key];                   
                    pack.facilityId = getFacilityName('cf3a1192-abe6-44db-98a9-9167e2d24511')//getFacilityName(pack.facilityId);
                    pack.programId = getProgramName('bab14d97-1f33-4e10-b589-46b8f0a74477');//getProgramName(pack.programId);
                    console.log(pack);                    
                }
            }
        }

        vm.prepackDetails = function(item){
            $state.go('openlmis.stockmanagement.' + 'prepack'+ '.creation', {
                programId: item.programId,
                program: getProgramName(item.programId),
                facility: facility
            });
        }
    }
})()