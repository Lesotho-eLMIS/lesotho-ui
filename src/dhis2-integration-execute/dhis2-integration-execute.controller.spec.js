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

describe('IntegrationExecuteController', function() {

    beforeEach(function() {
        module('dhis2-integration-execute');
        module('dhis2-integration');
        module('dhis2-execution');
        module('dhis2-configuration');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.IntegrationDataBuilder = $injector.get('IntegrationDataBuilder');
            this.PeriodDataBuilder = $injector.get('PeriodDataBuilder');
            this.ExecutionResource = $injector.get('ExecutionResource');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
        });

        this.integration = new this.IntegrationDataBuilder().build();

        this.periods = [
            new this.PeriodDataBuilder().build(),
            new this.PeriodDataBuilder().build()
        ];

        this.description = 'Description';

        this.stateParams = {
            page: 0,
            size: 10
        };

        this.vm = this.$controller('IntegrationExecuteController', {
            integrationId: this.integration.id,
            periods: this.periods,
            $stateParams: this.stateParams
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
        spyOn(this.loadingModalService, 'open').andReturn(this.$q.resolve());
        spyOn(this.ExecutionResource.prototype, 'startManualExecution').andReturn(this.$q.resolve());
        spyOn(this.notificationService, 'success').andReturn();
    });

    describe('onInit', function() {

        it('should expose integrationId', function() {
            expect(this.vm.integrationId).toEqual(this.integrationId);
        });

        it('should expose periods', function() {
            expect(this.vm.periods).toEqual(this.periods);
        });

    });

    describe('startManualExecution', function() {

        it('should call startManualExecution method', function() {
            this.vm.integrationId = this.integration.id;
            this.vm.selectedPeriod = this.periods[0];
            this.vm.description = this.description;

            this.vm.startManualExecution();
            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
            expect(this.ExecutionResource.prototype.startManualExecution)
                .toHaveBeenCalledWith({
                    integrationId: this.integration.id,
                    periodId: this.periods[0].id,
                    description: this.description
                });

            expect(this.$state.go).toHaveBeenCalled();
            expect(this.notificationService.success)
                .toHaveBeenCalledWith('dhis2IntegrationExecute.manualExecutionStarted');
        });
    });

    describe('goToIntegrationList', function() {

        it('should call state go method', function() {
            this.vm.goToIntegrationList();

            expect(this.$state.go).toHaveBeenCalled();
        });
    });
});
