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

describe('IntegrationAddEditController', function() {

    beforeEach(function() {
        module('dhis2-integration-edit');
        module('dhis2-integration');
        module('dhis2-configuration');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.IntegrationDataBuilder = $injector.get('IntegrationDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.ConfigurationDataBuilder = $injector.get('ConfigurationDataBuilder');
            this.IntegrationResource = $injector.get('IntegrationResource');
            this.loadingModalService = $injector.get('loadingModalService');
            this.confirmService = $injector.get('confirmService');
            this.notificationService = $injector.get('notificationService');
        });

        this.integration = new this.IntegrationDataBuilder().build();

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.configurations = [
            new this.ConfigurationDataBuilder().build(),
            new this.ConfigurationDataBuilder().build()
        ];

        this.stateParams = {
            page: 0,
            size: 10
        };

        this.vm = this.$controller('IntegrationAddEditController', {
            integration: this.integration,
            programs: this.programs,
            configurations: this.configurations,
            $stateParams: this.stateParams
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
        spyOn(this.IntegrationResource.prototype, 'update').andReturn(this.$q.resolve());
        spyOn(this.IntegrationResource.prototype, 'create').andReturn(this.$q.resolve());
        spyOn(this.notificationService, 'success').andReturn();
    });

    describe('onInit', function() {

        it('should expose integrations array', function() {
            expect(this.vm.integration).toEqual(this.integration);
        });

        it('should expose programs', function() {
            expect(this.vm.programs).toEqual(this.programs);
        });

        it('should expose configurations', function() {
            expect(this.vm.configurations).toEqual(this.configurations);
        });

    });

    describe('saveIntegration', function() {

        it('should create integration', function() {
            this.vm.integration.id = undefined;

            this.vm.saveIntegration();
            this.$rootScope.$apply();

            expect(this.IntegrationResource.prototype.create).toHaveBeenCalledWith(this.integration);
            expect(this.notificationService.success)
                .toHaveBeenCalledWith('dhis2IntegrationEdit.integrationAddSuccessfully');
        });

        it('should update integration', function() {
            this.vm.saveIntegration();
            this.$rootScope.$apply();

            expect(this.IntegrationResource.prototype.update).toHaveBeenCalledWith(this.integration);
            expect(this.notificationService.success)
                .toHaveBeenCalledWith('dhis2IntegrationEdit.integrationEditSuccessfully');
        });

        it('should redirect to the previous state on success', function() {
            this.vm.saveIntegration();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalled();
        });

        it('should not redirect to the previous state on failure create', function() {
            this.IntegrationResource.prototype.create.andReturn(this.$q.reject());
            this.vm.integration.id = undefined;

            this.vm.saveIntegration();
            this.$rootScope.$apply();

            expect(this.$state.go).not.toHaveBeenCalled();
        });

        it('should not redirect to the previous state on failure update', function() {
            this.IntegrationResource.prototype.update.andReturn(this.$q.reject());

            this.vm.saveIntegration();
            this.$rootScope.$apply();

            expect(this.$state.go).not.toHaveBeenCalled();
        });
    });

    describe('goToIntegrationList', function() {

        it('should call state go method', function() {
            this.vm.goToIntegrationList();

            expect(this.$state.go).toHaveBeenCalled();
        });
    });
});
