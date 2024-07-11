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
     * @ngdoc object
     * @name openlmis-cron-selection.SIMPLE_CRON_REGEX
     *
     * @description
     * Stores a regex for testing whether string is a simple cron expression meaning it can be displayed by the
     * openlmis-cron-selection directive in a user friendly way.
     */
    angular
        .module('openlmis-cron-selection')
        .constant('SIMPLE_CRON_REGEX', new RegExp(
            '^' +
            //seconds, only 0 allowed
            '0 ' +
            //minutes, 0 - 59 allowed
            '[0-5]?[0-9] ' +
            //hour, 0 - 23 allowed
            '([0-1][0-9]|2[0-3]|[0-9]) ' +
            //day, only every day or once a month allowed
            '(\\*|([1-9]|[12][0-9]|3[01]){1,2}) ' +
            //month, only every day allowed
            '\\* ' +
            //weekday, only daily or once a week allowed
            '([*]|[0-6])' +
            '$'
        ));

})();
