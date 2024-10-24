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
     * @name dispensing.dispensingService
     *
     * @description
     * Responsible for dispensing data as well as commiting it to the server.
     */
    angular
        .module('dispensing')
        .service('dispensingService', dispensingService);

        dispensingService.$inject = ['$resource','openlmisUrlFactory', 'notificationService', 'confirmService','openlmisModalService'];

    function dispensingService($resource,openlmisUrlFactory, notificationService, confirmService, openlmisModalService ) {

        // var promise,
        //     POD_FACILITIES = 'dispensingPatientsFacilities';
           // Using Resource to Communicate with dispensing Endpoints

            var resource = $resource(openlmisUrlFactory('/api/patient:id'), {}, {
                get: {
                    url: openlmisUrlFactory('/api/patient'),
                    method: 'GET',
                    isArray: true
                },
                getV2: {
                    url: openlmisUrlFactory('/api/patient/v2'),
                    method: 'GET'
                }, 
                getPatient: {
                    url: openlmisUrlFactory('/api/patient/:id'),
                    method: 'GET',
                    isArray: true
                },
                postPatientEvent: {
                    url: openlmisUrlFactory('/api/patient'),
                    method: 'POST'
                },
                updatePatientEvent: {
                    url: openlmisUrlFactory('/api/patient/:id'),
                    method: 'PUT'
                }, 
                search: {
                    url: openlmisUrlFactory('/api/patient'),
                    method: 'GET'
                },            
            });

        this.show = show;
 
        this.submitPatientInfo = submitPatientInfo; // To post data POD Manage payload
        this.updatePatientInfo = updatePatientInfo;
        this.getPatients = getPatients; //To retrieve PODs from the database
        this.getPatient = getPatient;
        this.getPatientsV2 = getPatientsV2;

        var patients = [];     

        /**
         * @ngdoc method
         * @methodOf point-of-delivery.pointOfDeliveryService
         * @name getPatients
         *
         * @description
         * Retrieves POD records from the server.
         *
         * @param  {String}     Facility UUID
         * @return {Promise}    POD promise
         */
        function getPatients(patientParams) {
            var params = {
                patientNumber: patientParams.patientNumber,
                firstName: patientParams.firstName,
                lastName: patientParams.lastName,
                dateOfBirth: patientParams.dateOfBirth,
                nationalId: patientParams.nationalId,
                facilityId:patientParams.facilityId,
                geoZoneId:patientParams.geoZoneId
            };
           
            return resource.get(params).$promise.then(function(response) {
                //Transforming the response to an object if it's an array
                    if (Array.isArray(response)) {
                                    
                        var objectOfPatients = response.reduce((result, obj) => {
                        result[obj.id] = obj;
                       
                        return result;
                        }, {});                        
                        return objectOfPatients;                         
                    }
               return response; 
             });
        };


        function getPatientsV2(patientsParams) {
            console.log(patientsParams);
            return resource.getV2(patientsParams).$promise;
        };

        function getPatient(patientId) {
            var params = { id: patientId };
            return resource.get(params);
          };

        function createPatientPayload(patientInfo) {
            var payload = {
                "facilityId": patientInfo.facilityId,
                "geoZoneId" : patientInfo.geoZoneId,
                "personDto": {
                    "nationalId": patientInfo.nationalID,
                    "firstName": patientInfo.firstName,
                    "lastName": patientInfo.lastName,
                    "nickName": patientInfo.nickName,
                    "sex": patientInfo.sex,
                    "dateOfBirth": patientInfo.dateOfBirth,
                    "isDobEstimated": patientInfo.isDobEstimated,
                    "physicalAddress": patientInfo.physicalAddress,
                    "nextOfKinFullName": patientInfo.nextOfKinFullName,
                    "nextOfKinContact": patientInfo.nextOfKinContact,
                    "motherMaidenName": patientInfo.motherMaidenName,
                    "deceased": patientInfo.deceased,
                    "retired": patientInfo.retired,
                    "chief": patientInfo.chief,
                    "occupation": patientInfo.occupation,
                    "contacts": [
                        {
                            "contactType": patientInfo.contact.contactType,
                            "contactValue": patientInfo.contact //TO DO : handle multiple contacts
                        }
                    ]
                },
                "medicalHistory": [
                    {
                        "type": "Diagnosis",
                        "history": "Diagnosed with letsoejane."
                    },
                    {
                        "type": "Treatment",
                        "history": "O sebelisa hloella-hape (iphinde futhi)."
                    }
                ]
            }
            return payload;
        }
 
        function submitPatientInfo(patientInfo){  
          
            var payload = createPatientPayload(patientInfo);
            return resource.postPatientEvent(payload).$promise;
        }


        function updatePatientInfo(patientInfo){
            
            var payload = createPatientPayload(patientInfo);
        
            return resource.updatePatientEvent({ id: patientInfo.id }, payload).$promise;
        }


        /**
         * @ngdoc method
         * @methodOf point-of-delivery.pointOfDeliveryService
         * @name show
         *
         * @description
         * Shows modal that allows users to add discrepancies.
         *
         * @param  {Array}   rejectionReasons 
         * @param  {String}   shipmentType  
         * @return {Promise}                resolved with discrepancies.
         */
        function show (shipmentType) {
            return openlmisModalService.createDialog(
                {
                    controller: 'dispensingPrescriptionDetailsModalController',
                    controllerAs: 'vm',
                    templateUrl: 'dispensing-prescription-details-modal/dispensing-prescription-details-modal.html',
                    show: true ,
                    resolve: {
                        rejectionReasons: function(rejectionReasonService) {
                                // Load rejection Reasons into the controller.
                                return rejectionReasonService.getAll();
                            
                        }, 
                        shipmentType: function () {
                            return shipmentType;
                        }
                    }   
                }
            ).promise.finally(function() {
                angular.element('.openlmis-popover').popover('destroy');
            });
        }
        
    }
})();