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
        .module('dhis2-execution-list')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider.state('openlmis.administration.dhis2.executions', {
            label: 'dhis2.executions',
            url: '/executions?page&size&sort',
            controller: 'ExecutionListController',
            templateUrl: 'dhis2-execution-list/dhis2-execution-list.html',
            controllerAs: 'vm',
            resolve: {
                executions: function(paginationService, ExecutionResource, $stateParams) {
                    return paginationService.registerUrl($stateParams, function(stateParams) {
                        if (!stateParams.sort) {
                            stateParams.sort = 'startDate,desc';
                        }

                        return new ExecutionResource().query(stateParams);
                    });
                },
                queueItems: function(ExecutionQueueResource) {
                    return new ExecutionQueueResource().query();
                },
                periods: function(executions, queueItems, ProcessingPeriodResource) {
                    if ((!executions || executions.length === 0)
                        && (!queueItems || queueItems.length === 0)) {
                        return [];
                    }

                    var periodIds = [];

                    if (executions) {
                        executions.forEach(function(execution) {
                            if (periodIds.indexOf(execution.processingPeriodId) < 0) {
                                periodIds.push(execution.processingPeriodId);
                            }
                        });
                    }

                    if (queueItems) {
                        queueItems.forEach(function(queueItem) {
                            if (periodIds.indexOf(queueItem.processingPeriodId) < 0) {
                                periodIds.push(queueItem.processingPeriodId);
                            }
                        });
                    }

                    return new ProcessingPeriodResource()
                        .query({
                            id: periodIds
                        })
                        .then(function(page) {
                            return page.content;
                        });
                },
                periodsMap: function(periods) {
                    return periods.reduce(function(periodsMap, period) {
                        periodsMap[period.id] = period;
                        return periodsMap;
                    }, {});
                },
                users: function(ReferenceDataUserResource) {
                    return new ReferenceDataUserResource().query()
                        .then(function(users) {
                            return users.content;
                        });
                },
                usersMap: function(users) {
                    return users.reduce(toUsersMap, {});
                }
            }
        });
    }
    function toUsersMap(usersMap, user) {
        usersMap[user.id] = user;
        return usersMap;
    }
})();
