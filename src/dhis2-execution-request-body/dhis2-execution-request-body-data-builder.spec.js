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
        .module('dhis2-execution-request-body')
        .factory('ExecutionRequestBodyDataBuilder', ExecutionRequestBodyDataBuilder);

    ExecutionRequestBodyDataBuilder.$inject = ['RequestBody'];

    function ExecutionRequestBodyDataBuilder(RequestBody) {

        ExecutionRequestBodyDataBuilder.prototype.withFacilities = withFacilities;
        ExecutionRequestBodyDataBuilder.prototype.withReportingPeriod = withReportingPeriod;
        ExecutionRequestBodyDataBuilder.prototype.withDescription = withDescription;
        ExecutionRequestBodyDataBuilder.prototype.build = build;
        ExecutionRequestBodyDataBuilder.prototype.buildJson = buildJson;

        return ExecutionRequestBodyDataBuilder;

        function ExecutionRequestBodyDataBuilder() {
            ExecutionRequestBodyDataBuilder.instanceNumber = (ExecutionRequestBodyDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = ExecutionRequestBodyDataBuilder.instanceNumber;
            this.facilities = 'F' + instanceNumber;
            this.reportingPeriod = 'RP' + instanceNumber;
            this.description = 'test-description';
        }

        function withFacilities(facilities) {
            this.facilities = facilities;
            return this;
        }

        function withReportingPeriod(reportingPeriod) {
            this.reportingPeriod = reportingPeriod;
            return this;
        }

        function withDescription(description) {
            this.description = description;
            return this;
        }

        function build() {
            return new RequestBody(this.buildJson());
        }

        function buildJson() {
            return {
                facilities: this.facilities,
                reportingPeriod: this.reportingPeriod,
                description: this.description
            };
        }

    }
})();
