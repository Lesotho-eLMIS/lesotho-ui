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

describe('ExecutionResource', function() {

    beforeEach(function() {
        this.OpenlmisResourceMock = jasmine.createSpy('OpenlmisResource');
        this.create = jasmine.createSpy('create');
        this.OpenlmisResourceMock.prototype.create = this.create;
        // this.startManualExecution = jasmine.createSpy('startManualExecution');
        // this.OpenlmisResourceMock.prototype.startManualExecution = this.startManualExecution;
        var OpenlmisResourceMock = this.OpenlmisResourceMock;
        module('dhis2-execution', function($provide) {
            $provide.factory('OpenlmisResource', function() {
                return OpenlmisResourceMock;
            });
        });

        inject(function($injector) {
            this.ExecutionResource = $injector.get('ExecutionResource');
            this.ManualExecutionDataBuilder = $injector.get('ManualExecutionDataBuilder');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
        });

        this.create.andReturn(this.$q.resolve());
    });

    it('should extend OpenlmisResource', function() {
        new this.ExecutionResource();

        expect(this.OpenlmisResourceMock).toHaveBeenCalledWith('/api/integrationExecutions', {
            paginated: true
        });
    });

    it('should start manual execution', function() {
        this.ManualExecution = new this.ManualExecutionDataBuilder().build();

        new this.ExecutionResource()
            .startManualExecution(this.ManualExecution);
        this.$rootScope.$apply();

        expect(this.create).toHaveBeenCalledWith(this.ManualExecution);
    });

});
