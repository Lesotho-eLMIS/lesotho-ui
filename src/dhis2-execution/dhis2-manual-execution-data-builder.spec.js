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
        .module('dhis2-execution')
        .factory('ManualExecutionDataBuilder', ManualExecutionDataBuilder);

    ManualExecutionDataBuilder.$inject = ['ManualExecution'];

    function ManualExecutionDataBuilder(ManualExecution) {

        ManualExecutionDataBuilder.prototype.withProgramId = withProgramId;
        ManualExecutionDataBuilder.prototype.withFacilityId = withFacilityId;
        ManualExecutionDataBuilder.prototype.withPeriodId = withPeriodId;
        ManualExecutionDataBuilder.prototype.withDescription = withDescription;
        ManualExecutionDataBuilder.prototype.build = build;
        ManualExecutionDataBuilder.prototype.buildJson = buildJson;

        return ManualExecutionDataBuilder;

        function ManualExecutionDataBuilder() {
            ManualExecutionDataBuilder.instanceNumber = (ManualExecutionDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = ManualExecutionDataBuilder.instanceNumber;
            this.programId = 'P' + instanceNumber;
            this.facilityId = 'F' + instanceNumber;
            this.periodId = 'PP' + instanceNumber;
            this.description = 'test-description';
        }

        function withProgramId(programId) {
            this.programId = programId;
            return this;
        }

        function withFacilityId(facilityId) {
            this.facilityId = facilityId;
            return this;
        }

        function withPeriodId(periodId) {
            this.periodId = periodId;
            return this;
        }

        function withDescription(description) {
            this.description = description;
            return this;
        }

        function build() {
            return new ManualExecution(this.buildJson());
        }

        function buildJson() {
            return {
                programId: this.programId,
                facilityId: this.facilityId,
                periodId: this.periodId,
                description: this.description
            };
        }

    }

})();
