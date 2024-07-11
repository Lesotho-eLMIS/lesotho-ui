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
     * @ngdoc directive
     * @name openlmis-cron-selection.openlmisCronSelection
     * @restrict E
     *
     * @description
     * Directive providing a method for building cron expressions. If a cron that is not in form of "daily at .." or
     * "weekly on .. at .." an input will be shown allowing the user to edit the cron expression.
     * 
     * @example 
     * To add the tag selection component simply include the following code in your HTML file:
     * ```
     * <openlmis-cron-selection ng-model="modelVar"></openlmis-cron-selection>
     * ```
     */
    angular
        .module('openlmis-cron-selection')
        .directive('openlmisCronSelection', openlmisCronSelectionDirective);

    openlmisCronSelectionDirective.$inject = ['CRON_REGEX', 'SIMPLE_CRON_REGEX', 'WEEKDAYS', 'OCCURRENCES'];

    function openlmisCronSelectionDirective(CRON_REGEX, SIMPLE_CRON_REGEX, WEEKDAYS, OCCURRENCES) {
        return {
            link: link,
            templateUrl: 'openlmis-cron-selection/openlmis-cron-selection.html',
            require: 'ngModel',
            scope: {
                ngRequired: '=',
                ngDisabled: '=',
                readOnly: '='
            },
            restrict: 'E'
        };

        function link(scope, _, __, ngModelCtrl) {
            scope.weekdays = WEEKDAYS;
            scope.occurrences = OCCURRENCES;

            scope.validateHour = validateHour;
            scope.validateMinute = validateMinute;
            scope.validateDay = validateDay;
            scope.validateCronExpression = validateCronExpression;
            // Malawi: add months
            scope.isMonthly = isMonthly;
            // --- ends here ---
            scope.isWeekly = isWeekly;
            scope.isDaily = isDaily;

            ngModelCtrl.$formatters.push(modelToViewValue);
            ngModelCtrl.$parsers.push(viewToModelValue);
            ngModelCtrl.$render = function() {
                scope.occurrence = evaluateOccurrence(ngModelCtrl.$viewValue.weekday, ngModelCtrl.$viewValue.day);
                scope.weekday = scope.weekdays[ngModelCtrl.$viewValue.weekday];
                scope.day = ngModelCtrl.$viewValue.day;
                scope.hour = ngModelCtrl.$viewValue.hour;
                scope.minute = ngModelCtrl.$viewValue.minute;
                scope.cronExpression = ngModelCtrl.$viewValue.cronExpression;
                scope.isComplex = ngModelCtrl.$viewValue.isComplex;
            };

            scope.$watch('occurrence', handleScopeChange);
            scope.$watch('weekday', handleScopeChange);
            scope.$watch('day', handleScopeChange);
            scope.$watch('hour', handleScopeChange);
            scope.$watch('minute', handleScopeChange);
            scope.$watch('cronExpression', handleScopeChange);

            function handleScopeChange(newVal, oldVal) {
                var weekday = evaluateWeekday(scope.occurrence,
                        convertWeekdayToNumber(scope.weekdays, scope.weekday),
                        evaluateDefaultForWeekly(oldVal, newVal)),
                    day = evaluateDay(scope.occurrence, scope);

                ngModelCtrl.$setViewValue(buildViewValue(
                    scope.minute, scope.hour, day, weekday, scope.cronExpression, scope.isComplex
                ));
            }

            function modelToViewValue(modelValue) {
                if (modelValue) {
                    var split = modelValue.split(' '),
                        minute = split[1],
                        hour = split[2],
                        day = split[3],
                        weekday = split[5],
                        cronExpression = modelValue;
                }
                var isComplex = modelValue ? isComplexCron(modelValue) : false;

                return buildViewValue(minute, hour, day, weekday, cronExpression, isComplex);
            }

            function viewToModelValue(viewValue) {
                if (viewValue.isComplex) {
                    return isValidCron(viewValue.cronExpression) ? viewValue.cronExpression : '';
                }
                if (isViewValueValid(viewValue)) {
                    return buildModelValue(viewValue.minute, viewValue.hour, viewValue.day, viewValue.weekday);
                }
                return '';
            }

            function validateCronExpression(cronExpression, isComplex, ngDisabled) {
                return !ngDisabled && isComplex && !isValidCron(cronExpression) ?
                    'openlmisCronSelection.invalidCron' : undefined;
            }

            function isValidCron(cronExpression) {
                return !cronExpression || CRON_REGEX.test(cronExpression);
            }

            function isComplexCron(value) {
                return !SIMPLE_CRON_REGEX.test(value);
            }

            function evaluateDefaultForWeekly(oldVal, newVal) {
                var SUNDAY = 0;
                if (isWeekly(newVal, OCCURRENCES) && isDaily(oldVal, OCCURRENCES)) {
                    return SUNDAY;
                }
            }

            function evaluateOccurrence(weekday, day) {
                var DAILY = '*';

                if (!weekday && !day) {
                    return;
                }

                if (day === DAILY) {
                    return weekday === DAILY ? OCCURRENCES.DAILY : OCCURRENCES.WEEKLY;
                }

                return OCCURRENCES.MONTHLY;
            }

            function evaluateDay(occurrence, scope) {
                if (isDaily(occurrence, OCCURRENCES) || isWeekly(occurrence, OCCURRENCES)) {
                    return '*';
                } else if (isMonthly(occurrence, OCCURRENCES)) {
                    if (scope.day === '*') {
                        scope.day = '';
                    }
                    return scope.day;
                }
                return undefined;
            }

            function evaluateWeekday(occurrence, weekday, defaultForWeekly) {
                var DAILY = '*';
                if (isDaily(occurrence, OCCURRENCES) || isMonthly(occurrence, OCCURRENCES)) {
                    return DAILY;
                } else if (isWeekly(occurrence, OCCURRENCES)) {
                    return weekday === undefined ? defaultForWeekly : weekday;
                }
                return undefined;
            }
        }
    }

    function isDaily(occurrence, OCCURRENCES) {
        return occurrence === OCCURRENCES.DAILY;
    }

    function isWeekly(occurrence, OCCURRENCES) {
        return occurrence === OCCURRENCES.WEEKLY;
    }

    // Malawi: add months
    function isMonthly(occurrence, OCCURRENCES, day) {
        if (day === '*') {
            day = '';
        }
        return occurrence === OCCURRENCES.MONTHLY;
    }
    // --- ends here --- 
    function validateHour(hour, isComplex, ngDisabled) {
        if (!ngDisabled && hour && !isComplex && !isBetween(hour, 0, 23)) {
            return 'openlmisCronSelection.hourOutOfRange';
        }
    }

    function validateMinute(minute, isComplex, ngDisabled) {
        if (!ngDisabled && minute && !isComplex && !isBetween(minute, 0, 59)) {
            return 'openlmisCronSelection.minuteOutOfRange';
        }
    }

    // Malawi: add months
    function validateDay(day, isComplex, ngDisabled, isMonthly) {
        if (!ngDisabled && isMonthly && !isComplex && !isBetween(day, 1, 31)) {
            return 'openlmisCronSelection.dayOutOfRange';
        }
    }
    // --- ends here --- 

    function isViewValueValid(viewValue) {
        return isWeekdayValid(viewValue.weekday)
            && isDayValid(viewValue.day)
            && isHourValid(viewValue.hour)
            && isMinuteValid(viewValue.minute);
    }

    function isWeekdayValid(weekday) {
        return !_.isUndefined(weekday);
    }

    function isHourValid(hour) {
        return (hour || hour === 0)
            && isBetween(hour, 0, 23);
    }

    function isMinuteValid(minute) {
        return (minute || minute === 0)
            && isBetween(minute, 0, 59);
    }

    // Malawi: add months
    function isDayValid(day) {
        return day && (day === '*' || isBetween(day, 1, 31));
    }
    // --- ends here --- 

    function isBetween(number, start, end) {
        return number >= start
            && number <= end;
    }

    function buildModelValue(minute, hour, day, weekday) {
        return '0 ' + minute + ' ' + hour + ' ' + day + ' * ' + weekday;
    }

    function convertWeekdayToNumber(weekdays, weekday) {
        var index = weekdays.indexOf(weekday);

        return index > -1 ? index : undefined;
    }

    function buildViewValue(minute, hour, day, weekday, cronExpression, isComplex) {
        return {
            minute: minute,
            hour: hour,
            day: day,
            weekday: weekday,
            cronExpression: cronExpression,
            isComplex: isComplex
        };
    }

}());
