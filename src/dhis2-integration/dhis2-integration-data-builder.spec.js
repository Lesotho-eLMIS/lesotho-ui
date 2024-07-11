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
        .module('dhis2-integration')
        .factory('IntegrationDataBuilder', IntegrationDataBuilder);

    IntegrationDataBuilder.$inject = ['Integration', 'ConfigurationDataBuilder'];

    function IntegrationDataBuilder(Integration, ConfigurationDataBuilder) {

        IntegrationDataBuilder.prototype.withId = withId;
        IntegrationDataBuilder.prototype.withProgramId = withProgramId;
        IntegrationDataBuilder.prototype.withCronExpression = withCronExpression;
        IntegrationDataBuilder.prototype.withDescription = withDescription;
        IntegrationDataBuilder.prototype.withConfiguration = withConfiguration;
        IntegrationDataBuilder.prototype.build = build;
        IntegrationDataBuilder.prototype.buildJson = buildJson;

        return IntegrationDataBuilder;

        function IntegrationDataBuilder() {
            IntegrationDataBuilder.instanceNumber = (IntegrationDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = IntegrationDataBuilder.instanceNumber;
            this.id = 'integration-id-' + instanceNumber;
            this.programId = 'P' + instanceNumber;
            this.cronExpression = '1 * * * * *';
            this.description = 'Description';
            this.configuration = new ConfigurationDataBuilder().build();
        }

        function withId(id) {
            this.id = id;
            return this;
        }

        function withProgramId(programId) {
            this.programId = programId;
            return this;
        }

        function withCronExpression(cronExpression) {
            this.cronExpression = cronExpression;
            return this;
        }

        function withDescription(description) {
            this.description = description;
            return this;
        }

        function withConfiguration(newConfiguration) {
            this.configuration = newConfiguration;
            return this;
        }

        function build() {
            return new Integration(this.buildJson());
        }

        function buildJson() {
            return {
                id: this.id,
                programId: this.programId,
                cronExpression: this.cronExpression,
                description: this.description,
                configuration: this.configuration
            };
        }

    }

})();
