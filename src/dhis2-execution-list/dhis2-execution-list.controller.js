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
     * @name dhis2-execution-list:ExecutionListController
     *
     * @description
     * Controller for execution list view screen.
     */
    angular
        .module('dhis2-execution-list')
        .controller('ExecutionListController', controller);

    controller.$inject = [
        '$state', '$stateParams', 'executions', 'queueItems',
        'periodsMap', 'usersMap', 'users', 'notificationService',
        'RequestBodyResource', 'loadingModalService'
    ];

    function controller($state, $stateParams, executions, queueItems,
                        periodsMap, usersMap, users, notificationService,
                        RequestBodyResource, loadingModalService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.refreshPage = refreshPage;
        vm.showUser = showUser;
        vm.downloadRequestBodyJSON = downloadRequestBodyJSON;

        /**
         * @ngdoc property
         * @propertyOf dhis2-execution-list:ExecutionListController
         * @name usersMap
         * @type {Object}
         *
         * @description
         * Map of users who started execution.
         */
        vm.usersMap = undefined;

        /**
         * @ngdoc property
         * @propertyOf dhis2-execution-list:ExecutionListController
         * @name users
         * @type {Array}
         *
         * @description
         * List of users who started execution.
         */
        vm.users = undefined;
        /**
         * @ngdoc method
         * @propertyOf dhis2-execution-list:ExecutionListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ExecutionListController.
         */
        function onInit() {
            vm.executions = executions;
            vm.queueItems = queueItems;
            vm.usersMap = usersMap;
            vm.users = users;
            vm.periods = periodsMap;
        }

        /**
         * @ngdoc method
         * @propertyOf dhis2-execution-list:ExecutionListController
         * @name showUser
         *
         * @description
         * This method shows username.
         */
        function showUser(user) {
            if (user) {
                return user.firstName + ' ' + user.lastName;
            }
            if (!user) {
                return 'System';
            }
        }

        function refreshPage() {
            $state.go($state.current, $stateParams, {
                reload: true
            });
            notificationService.success('dhis2ExecutionList.pageHasBeenRefreshed');
        }

        function downloadRequestBodyJSON(data) {
            loadingModalService.open();

            return new RequestBodyResource()
                .get(data.id)
                .then(function(json) {
                    var fileName = data.description + '.json';

                    var fileToSave = new Blob([JSON.stringify(json, null, '\t')], {
                        type: 'application/json'
                    });
                    var url = URL.createObjectURL(fileToSave);

                    // Create a new anchor element
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = fileName || 'download';
                    a.click();
                    a.remove();
                    loadingModalService.close();
                });
        }

    }
})();
