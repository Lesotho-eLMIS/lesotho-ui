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

describe('ConfigurationListController', function() {

    beforeEach(function() {
        module('dhis2-configuration-list');
        module('dhis2-configuration');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.ConfigurationDataBuilder = $injector.get('ConfigurationDataBuilder');
            this.PeriodDataBuilder = $injector.get('PeriodDataBuilder');
            this.ConfigurationResource = $injector.get('ConfigurationResource');
            this.loadingModalService = $injector.get('loadingModalService');
            this.confirmService = $injector.get('confirmService');
            this.notificationService = $injector.get('notificationService');
        });

        this.configuration = new this.ConfigurationDataBuilder().build();
        this.configurations = [
            this.configuration,
            new this.ConfigurationDataBuilder().build()
        ];

        this.stateParams = {
            page: 0,
            size: 10
        };

        this.vm = this.$controller('ConfigurationListController', {
            configurations: this.configurations,
            $stateParams: this.stateParams
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
        spyOn(this.confirmService, 'confirmDestroy').andReturn(this.$q.resolve());
        spyOn(this.loadingModalService, 'open').andReturn(this.$q.resolve());
        spyOn(this.ConfigurationResource.prototype, 'delete').andReturn(this.$q.resolve());
        spyOn(this.notificationService, 'success').andReturn();
    });

    describe('onInit', function() {

        it('should expose configurations array', function() {
            expect(this.vm.configurations).toEqual(this.configurations);
        });

    });

    describe('deleteConfiguration', function() {

        it('should call deleteConfiguration method', function() {
            this.vm.deleteConfiguration(this.configuration);
            this.$rootScope.$apply();

            expect(this.confirmService.confirmDestroy).toHaveBeenCalledWith(
                'dhis2ConfigurationList.delete.confirm',
                'dhis2ConfigurationList.delete'
            );

            expect(this.loadingModalService.open).toHaveBeenCalled();
            expect(this.ConfigurationResource.prototype.delete).toHaveBeenCalledWith(this.configuration);
            expect(this.$state.go).toHaveBeenCalled();
            expect(this.notificationService.success)
                .toHaveBeenCalledWith('dhis2ConfigurationList.configurationDeletedSuccessfully');
        });
    });

    describe('refreshState', function() {

        it('should call state go method', function() {
            this.vm.refreshState();

            expect(this.$state.go).toHaveBeenCalled();
            expect(this.notificationService.success)
                .toHaveBeenCalledWith('dhis2ConfigurationEdit.pageHasBeenRefreshed');
        });
    });
});
