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

describe('ConfigurationAddEditController', function() {

    beforeEach(function() {
        module('dhis2-configuration-edit');
        module('dhis2-configuration');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.ConfigurationDataBuilder = $injector.get('ConfigurationDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.ConfigurationDataBuilder = $injector.get('ConfigurationDataBuilder');
            this.ConfigurationResource = $injector.get('ConfigurationResource');
            this.loadingModalService = $injector.get('loadingModalService');
            this.confirmService = $injector.get('confirmService');
            this.notificationService = $injector.get('notificationService');
        });

        this.configuration = new this.ConfigurationDataBuilder().build();

        this.stateParams = {
            page: 0,
            size: 10
        };

        this.vm = this.$controller('ConfigurationAddEditController', {
            configuration: this.configuration,
            $stateParams: this.stateParams
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
        spyOn(this.ConfigurationResource.prototype, 'update').andReturn(this.$q.resolve());
        spyOn(this.ConfigurationResource.prototype, 'create').andReturn(this.$q.resolve());
        spyOn(this.notificationService, 'success').andReturn();
    });

    describe('onInit', function() {

        it('should expose configuration array', function() {
            expect(this.vm.configuration).toEqual(this.configuration);
        });

    });

    describe('saveConfiguration', function() {

        it('should create configuration', function() {
            this.vm.configuration.id = undefined;

            this.vm.saveConfiguration();
            this.$rootScope.$apply();

            expect(this.ConfigurationResource.prototype.create).toHaveBeenCalledWith(this.configuration);
            expect(this.notificationService.success)
                .toHaveBeenCalledWith('dhis2ConfigurationEdit.configurationAddSuccessfully');
        });

        it('should update configuration', function() {
            this.vm.saveConfiguration();
            this.$rootScope.$apply();

            expect(this.ConfigurationResource.prototype.update).toHaveBeenCalledWith(this.configuration);
            expect(this.notificationService.success)
                .toHaveBeenCalledWith('dhis2ConfigurationEdit.configurationEditSuccessfully');
        });

        it('should redirect to the previous state on success', function() {
            this.vm.saveConfiguration();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalled();
        });

        it('should not redirect to the previous state on failure create', function() {
            this.ConfigurationResource.prototype.create.andReturn(this.$q.reject());
            this.vm.configuration.id = undefined;

            this.vm.saveConfiguration();
            this.$rootScope.$apply();

            expect(this.$state.go).not.toHaveBeenCalled();
        });

        it('should not redirect to the previous state on failure update', function() {
            this.ConfigurationResource.prototype.update.andReturn(this.$q.reject());

            this.vm.saveConfiguration();
            this.$rootScope.$apply();

            expect(this.$state.go).not.toHaveBeenCalled();
        });
    });

    describe('goToConfigurationList', function() {

        it('should call state go method', function() {
            this.vm.goToConfigurationList();

            expect(this.$state.go).toHaveBeenCalled();
        });
    });
});
