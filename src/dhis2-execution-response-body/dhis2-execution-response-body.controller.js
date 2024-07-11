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
     * @name dhis2-execution-response-body:ExecutionResponseBodyController
     *
     * @description
     * Controller for managing integration view screen.
     */
    angular
        .module('dhis2-execution-response-body')
        .controller('ExecutionResponseBodyController', controller);

    controller.$inject = ['$state', 'execution', '$filter'];

    function controller($state, execution, $filter) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToExecutionList  = goToExecutionList;
        vm.formatResponse = formatResponse;

        /**
         * @ngdoc property
         * @propertyOf dhis2-execution-response-body:ExecutionResponseBodyController
         * @name execution
         * @type {Array}
         *

         * @description
         * List of all execution.
         */
        vm.execution = undefined;

        /**
         * @ngdoc method
         * @propertyOf dhis2-execution-response-body:ExecutionResponseBodyController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ExecutionResponseBodyController.
         */
        function onInit() {
            vm.execution = execution;
        }

        /**
         * @ngdoc method
         * @methodOf dhis2-execution-response-body:ExecutionResponseBodyController
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

        function formatResponse() {
            if (!vm.execution.response) {
                return 'No response';
            }
            if (!vm.execution.response.body) {
                return 'No response body';
            }
            try {
                return $filter('json')(angular.fromJson(vm.execution.response.body));
            } catch (e) {
                return vm.execution.response.body;
            }
        }
    }
})();
