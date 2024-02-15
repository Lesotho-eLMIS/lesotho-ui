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

    angular
        .module('requisition-redistribution')
        .config(routes);

routes.$inject = ['$stateProvider'/*, 'STOCKMANAGEMENT_RIGHTS', 'ADJUSTMENT_TYPE'*/];

    function routes($stateProvider/*, STOCKMANAGEMENT_RIGHTS, ADJUSTMENT_TYPE*/) {
        $stateProvider.state('openlmis.redistribution', {
            url: '/redistribution/:rnr', 
            isOffline: true,
            controller: 'RequisitionRedistributionController',
            controllerAs: 'vm',
            templateUrl: 'requisition-redistribution/requisition-redistribution.html',
            resolve: {
                user: function(currentUserService) {
                    return currentUserService.getUserInfo();
                },
                requisition: function($stateParams,requisitionService) {
                    return requisitionService.get($stateParams.rnr);
                },
                facility: function(facilityService, requisition) {
                    return facilityService.get(requisition.facility.id);
                },
                program: function(programService, requisition) {
                    return programService.get(requisition.program.id);
                },
                processingPeriod: function(periodService, requisition) {
                    return periodService.get(requisition.processingPeriod.id);
                }
            }/*,
                program: function(programService, requisition) {
                    return programService.get(requisition.program.id);
                },
                processingPeriod: function(periodService, requisition) {
                    return periodService.get(requisition.processingPeriod.id);
                },
                facility: function(facilityService, requisition) {
                    return facilityService.get(requisition.facility.id);
                },
                canSubmit: function(requisitionViewFactory, user, requisition) {
                    return requisitionViewFactory.canSubmit(user.id, requisition);
                },
                canAuthorize: function(requisitionViewFactory, user, requisition) {
                    return requisitionViewFactory.canAuthorize(user.id, requisition);
                },
                canApproveAndReject: function(requisitionViewFactory, user, requisition) {
                    return requisitionViewFactory.canApproveAndReject(user, requisition);
                },
                canDelete: function(requisitionViewFactory, user, requisition) {
                    return requisitionViewFactory.canDelete(user.id, requisition);
                },
                canSkip: function(requisitionViewFactory, user, requisition, program) {
                    return requisitionViewFactory.canSkip(user.id, requisition, program);
                },
                canSync: function(canSubmit, canAuthorize, canApproveAndReject) {
                    return canSubmit || canAuthorize || canApproveAndReject;
                },
                canUnskipRequisitionItemWhenApproving: function(requisitionViewFactory, requisition) {
                    return requisitionViewFactory.canUnskipRequisitionItemWhenApproving(requisition);
                } */
        });
       
     }
})();
  
