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
     * @name dhis2.dhis2UrlFactory
     *
     * @description
     * Supplies application with dhis2 URL.
     */
    angular
        .module('dhis2')
        .factory('dhis2UrlFactory', factory);

    factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

    function factory(openlmisUrlFactory, pathFactory) {

        var dhis2Url = '@@DHIS2_SERVICE_URL';

        if (dhis2Url.substr(0, 2) === '@@') {
            dhis2Url = '';
        }

        /**
         * @ngdoc method
         * @methodOf dhis2.dhis2UrlFactory
         * @name dhis2UrlFactory
         *
         * @description
         * It parses the given URL and appends dhis2 service URL to it.
         *
         * @param  {String} url dhis2 URL from grunt file
         * @return {String}     dhis2 URL
         */
        return function(url) {
            url = pathFactory(dhis2Url, url);
            return openlmisUrlFactory(url);
        };
    }

})();
