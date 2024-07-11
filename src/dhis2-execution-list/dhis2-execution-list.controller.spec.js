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

describe('ExecutionListController', function() {

    beforeEach(function() {
        module('dhis2-execution-list');
        module('referencedata-period');
        module('dhis2-execution-request-body');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.ExecutionDataBuilder = $injector.get('ExecutionDataBuilder');
            this.PeriodDataBuilder = $injector.get('PeriodDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.notificationService = $injector.get('notificationService');
        });

        this.executions = [
            new this.ExecutionDataBuilder().build(),
            new this.ExecutionDataBuilder().build()
        ];

        this.periods = [
            new this.PeriodDataBuilder().build(),
            new this.PeriodDataBuilder().build()
        ];

        this.periodsMap = this.periods.reduce(function(periodsMap, period) {
            periodsMap[period.id] = period;
            return periodsMap;
        }, {});

        this.users = [
            new this.UserDataBuilder().buildReferenceDataUserJson(),
            new this.UserDataBuilder().buildReferenceDataUserJson()
        ];

        this.queueItems = [];

        this.usersMap = {};
        this.usersMap[this.users[0].id] = this.users[0];
        this.usersMap[this.users[1].id] = this.users[1];

        this.stateParams = {
            page: 0,
            size: 10
        };

        this.vm = this.$controller('ExecutionListController', {
            executions: this.executions,
            queueItems: this.queueItems,
            periodsMap: this.periodsMap,
            usersMap: this.usersMap,
            users: this.users,
            $stateParams: this.stateParams
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
        spyOn(this.vm, 'showUser').andReturn(this.$q.resolve());
        spyOn(this.notificationService, 'success').andReturn();
    });

    describe('onInit', function() {

        it('should expose executions array', function() {
            expect(this.vm.executions).toEqual(this.executions);
        });

        it('should expose queueItems array', function() {
            expect(this.vm.queueItems).toEqual(this.queueItems);
        });

        it('should expose periods', function() {
            expect(this.vm.periods).toEqual(this.periodsMap);
        });

        it('should expose users map', function() {
            expect(this.vm.usersMap).toEqual(this.usersMap);
        });
    });

    describe('showUser', function() {

        it('should call showUser method', function() {
            this.vm.showUser(this.users[0]);
            this.$rootScope.$apply();

            expect(this.vm.showUser).toHaveBeenCalledWith(this.users[0]);
        });
    });

    describe('refreshPage', function() {

        it('should call state go method', function() {
            this.vm.refreshPage();

            expect(this.$state.go).toHaveBeenCalled();
            expect(this.notificationService.success)
                .toHaveBeenCalledWith('dhis2ExecutionList.pageHasBeenRefreshed');
        });
    });
});
