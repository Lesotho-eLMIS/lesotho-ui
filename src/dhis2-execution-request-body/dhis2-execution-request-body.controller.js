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
     * @name dhis2-execution-request-body:ExecutionRequestBodyController
     *
     * @description
     * Controller for managing integration view screen.
     */
    angular
        .module('dhis2-execution-request-body')
        .controller('ExecutionRequestBodyController', controller);

    controller.$inject = ['$state', 'requestbody'];

    function controller($state, requestbody) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToExecutionList  = goToExecutionList;

        /**
         * @ngdoc property
         * @propertyOf dhis2-execution-request-body:ExecutionRequestBodyController
         * @name requestbody
         * @type {Array}
         *

         * @description
         * List of all requestbody.
         */
        vm.requestbody = undefined;

        /**
         * @ngdoc method
         * @propertyOf dhis2-execution-request-body:ExecutionRequestBodyController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ExecutionRequestBodyController.
         */
        function onInit() {
            vm.requestbody = requestbody;
        }

        /**
         * @ngdoc method
         * @methodOf dhis2-execution-request-body:ExecutionRequestBodyController
         * @name goToIntegrationList
         *
         * @description
         * Redirects to integration list screen.
         */
        function goToExecutionList(reload) {
            $state.go('openlmis.administration.dhis2.executions', {}, {
                reload: reload
            });
        }
    }
})();
