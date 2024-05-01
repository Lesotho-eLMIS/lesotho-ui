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
  
    controller.$inject = ['facility', 'user', 'programs', 'Prepacks', 'facilityService', '$state'];

    function controller(facility, user, programs, Prepacks, facilityService, $state){
        var vm = this;

        vm.onInit = onInit;
        vm.prepackDetails = [];
        vm.formatPrepacks = formatPrepacks;
        vm.getFacilityName = getFacilityName;
        vm.getProgramName = getProgramName;
        
        function onInit(){
            vm.facility = facility;            
            vm.user = user;
            vm.programs = programs;
            vm.prepackDetails = Prepacks;            
            formatPrepacks();
        }
        onInit();

        async function getFacilityName(facilityId) {
            try {
                const facilityObject = await facilityService.get(facilityId);
                return facilityObject.name;
            } catch (error) {
                console.error("Error:", error);
                return ""; // Or handle the error appropriately
            }
        }

       function getProgramName(programId){
            let program = vm.programs.find(item => item.id === programId);
            return program.name;
        }   

        async function formatPrepacks() {
            for (let key in vm.prepackDetails) {
                if (vm.prepackDetails.hasOwnProperty(key)) {
                    const pack =vm.prepackDetails[key];                  
                    pack.facilityName = await getFacilityName(pack.facilityId);
                    pack.programName = getProgramName(pack.programId);                   
                }
            }
        }

        vm.getPrepackLineItems = function(item){
            $state.go('openlmis.prepacking.details', {
                id: item.id,
                programId: item.programId,
                facilityId: item.facilityId
            });
        }
    }
})()