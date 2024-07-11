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

    /**
     * @ngdoc service
     * @name dhis2-configuration.Configuration
     *
     * @description
     * Represents a single configuration item.
     */
    angular
        .module('dhis2-configuration')
        .factory('Configuration', Configuration);

    function Configuration() {

        return Configuration;

        /**
         * @ngdoc methods
         * @methodOf dhis2-configuration.Configuration
         * @name Configuration
         *
         * @description
         * Creates a new instance of the Configuration class.
         *
         * @param  {Object} json the object that hold configuration info
         * @return {Object}      the configuration object
         */
        function Configuration(json) {
            this.id = json.id;
            this.name = json.name;
            this.targetUrl = json.targetUrl;
            this.authenticationDetails = json.authenticationDetails;
        }
    }
})();
