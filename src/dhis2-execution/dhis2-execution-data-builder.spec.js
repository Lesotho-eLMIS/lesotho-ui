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
        .factory('ExecutionDataBuilder', ExecutionDataBuilder);

    ExecutionDataBuilder.$inject = ['Execution'];

    function ExecutionDataBuilder(Execution) {

        ExecutionDataBuilder.prototype.withId = withId;
        ExecutionDataBuilder.prototype.withManualExecution = withManualExecution;
        ExecutionDataBuilder.prototype.withProgramId = withProgramId;
        ExecutionDataBuilder.prototype.withFacilityId = withFacilityId;
        ExecutionDataBuilder.prototype.withProcessingPeriodId = withProcessingPeriodId;
        ExecutionDataBuilder.prototype.withDescription = withDescription;
        ExecutionDataBuilder.prototype.withTargetUrl = withTargetUrl;
        ExecutionDataBuilder.prototype.withStartDate = withStartDate;
        ExecutionDataBuilder.prototype.withEndDate = withEndDate;
        ExecutionDataBuilder.prototype.withResponse = withResponse;
        ExecutionDataBuilder.prototype.withUserId = withUserId;
        ExecutionDataBuilder.prototype.build = build;
        ExecutionDataBuilder.prototype.buildJson = buildJson;

        return ExecutionDataBuilder;

        function ExecutionDataBuilder() {
            ExecutionDataBuilder.instanceNumber = (ExecutionDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = ExecutionDataBuilder.instanceNumber;
            this.id = 'execution-id-' + instanceNumber;
            this.manualExecution = true;
            this.programId = 'P' + instanceNumber;
            this.facilityId = 'F' + instanceNumber;
            this.processingPeriodId = 'PP' + instanceNumber;
            this.description = 'test-description';
            this.targetUrl = 'http://test.execution';
            this.startDate = new Date('2019-01-01');
            this.endDate = new Date('2019-01-02');
            this.response = {
                resopnseDate: new Date('2019-01-03'),
                statusCode: '200',
                body: 'Message OK'
            };
            this.userId = 'UID' + instanceNumber;
        }

        function withId(id) {
            this.id = id;
            return this;
        }

        function withManualExecution(manualExecution) {
            this.manualExecution = manualExecution;
            return this;
        }

        function withProgramId(programId) {
            this.programId = programId;
            return this;
        }

        function withFacilityId(facilityId) {
            this.facilityId = facilityId;
            return this;
        }

        function withProcessingPeriodId(processingPeriodId) {
            this.processingPeriodId = processingPeriodId;
            return this;
        }

        function withDescription(description) {
            this.description = description;
            return this;
        }

        function withTargetUrl(targetUrl) {
            this.targetUrl = targetUrl;
            return this;
        }

        function withStartDate(startDate) {
            this.startDate = startDate;
            return this;
        }

        function withResponse(resopnseDate, statusCode, body) {
            this.response.resopnseDate = resopnseDate;
            this.response.statusCode = statusCode;
            this.response.body = body;
            return this;
        }

        function withEndDate(endDate) {
            this.endDate = endDate;
            return this;
        }

        function withUserId(userId) {
            this.userId = userId;
            return this;
        }

        function build() {
            return new Execution(this.buildJson());
        }

        function buildJson() {
            return {
                id: this.id,
                manualExecution: this.manualExecution,
                programId: this.programId,
                facilityId: this.facilityId,
                processingPeriodId: this.processingPeriodId,
                description: this.description,
                targetUrl: this.targetUrl,
                startDate: this.startDate,
                endDate: this.endDate,
                response: this.response,
                userId: this.userId
            };
        }

    }

})();
