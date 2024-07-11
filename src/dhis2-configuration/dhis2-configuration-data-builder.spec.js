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
        .module('dhis2-configuration')
        .factory('ConfigurationDataBuilder', ConfigurationDataBuilder);

    ConfigurationDataBuilder.$inject = ['Configuration'];

    function ConfigurationDataBuilder(Configuration) {

        ConfigurationDataBuilder.prototype.withId = withId;
        ConfigurationDataBuilder.prototype.withName = withName;
        ConfigurationDataBuilder.prototype.withTargetUrl = withTargetUrl;
        ConfigurationDataBuilder.prototype.withAuthenticationDetails = withAuthenticationDetails;
        ConfigurationDataBuilder.prototype.build = build;
        ConfigurationDataBuilder.prototype.buildJson = buildJson;

        return ConfigurationDataBuilder;

        function ConfigurationDataBuilder() {
            ConfigurationDataBuilder.instanceNumber = (ConfigurationDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = ConfigurationDataBuilder.instanceNumber;
            this.id = 'configuration-id-' + instanceNumber;
            this.name = 'name ' + instanceNumber;
            this.targetUrl = 'http://test.configuration';
            this.authenticationDetails = {
                type: 'BASIC',
                username: 'username',
                password: 'password'
            };
        }

        function withId(id) {
            this.id = id;
            return this;
        }

        function withName(name) {
            this.name = name;
            return this;
        }

        function withTargetUrl(targetUrl) {
            this.targetUrl = targetUrl;
            return this;
        }

        function withAuthenticationDetails(type, username, password) {
            this.authenticationDetails.type = type;
            this.authenticationDetails.username = username;
            this.authenticationDetails.password = password;
            return this;
        }

        function build() {
            return new Configuration(this.buildJson());
        }

        function buildJson() {
            return {
                id: this.id,
                name: this.name,
                targetUrl: this.targetUrl,
                authenticationDetails: this.authenticationDetails
            };
        }

    }

})();
