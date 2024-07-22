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
     * @name dispensing-prescriptions.prescriptionsService
     *
     * @description
     * Responsible for prescriptions data as well as commiting it to the server.
     */
    angular
        .module('dispensing-prescriptions')
        .service('prescriptionsService', prescriptionsService);

        prescriptionsService.$inject = ['$resource','openlmisUrlFactory', 'notificationService', 'confirmService','openlmisModalService'];

    function prescriptionsService($resource,openlmisUrlFactory, notificationService, confirmService, openlmisModalService ) {

        // var promise,
        //     POD_FACILITIES = 'dispensingPatientsFacilities';
           // Using Resource to Communicate with dispensing Endpoints

            var resource = $resource(openlmisUrlFactory('api/prescription:id'), {}, {
                get: {
                    url: openlmisUrlFactory('api/prescription'),
                    method: 'GET',
                    isArray: true
                }, 
                postPrescriptionEvent: {
                    url: openlmisUrlFactory('api/prescription'),
                    method: 'POST'
                }
                // updatePatientEvent: {
                //     url: openlmisUrlFactory('/api/patient:id'),
                //     method: 'PUT'
                // }, 
                // search: {
                //     url: openlmisUrlFactory('/api/patient'),
                //     method: 'GET'
                // },            
            });

       // this.show = show;
 
        this.createPrescription = createPrescription; // To post Prescription paylodad
        this.getPrescription = getPrescription; //To retrieve a Prescription record from the database
        
      //  var patients = [];     

        /**
         * @ngdoc method
         * @methodOf dispensing-prescriptions.prescriptionsService
         * @name getPrescription
         *
         * @description
         * Retrieves Prescription details.
         *
         * @param  {String}     Facility UUID
         * @return {Promise}    Prescription promise
         */
        function getPrescription(prescriptionParams) {
            // var params = {
            //     patientNumber: patientParams.patientNumber,
            //     firstName: patientParams.firstName,
            //     lastName: patientParams.lastName,
            //     dateOfBirth: patientParams.dateOfBirth,
            //     nationalId: patientParams.nationalId,
            //     facilityId:patientParams.facilityId
            // };
            // console.log("Prescription Service");
            // console.log(params);
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
 
         /**
         * @ngdoc method
         * @methodOf dispensing-prescriptions.prescriptionsService
         * @name createPrescription
         *
         * @description
         * Post prescription details.
         *
         * @param  {String}     Facility UUID
         * @return {Promise}    Prescription promise
         */
        function createPrescription(){
            
           var prescriptionDetails = {
              "patientId": "22326e87-08ad-48d4-ab61-fc76c268e891",
              "patientType": "Outpatient",
              "followUpDate": "2024-07-14",
              "issueDate": "2024-07-07",
              "createdDate": "2024-07-07",
              "capturedDate": "2024-07-07",
              "lastUpdate": "2024-07-07",
              "isVoided": false,
              "status": "Active",
              "facilityId": "81b63356-d08b-42e9-af39-ca9e266ef3a7",
              "userId": "df255157-0162-4466-ad7d-b73f6b2d9774",
              "lineItems": [
                {
                  "id": "c1f77c60-5f7e-11ec-bf63-0242ac130004",
                  "dosage": "500mg",
                  "period": 7,
                  "batchId": "batch-001",
                  "quantityPrescribed": 30,
                  "quantityDispensed": 30,
                  "servedInternally": true,
                  "orderableId":"167ee72e-04a4-4f97-bcd9-4365015fd157",
                  "substituteOrderableId": "dbaa07c0-66cd-43ed-9272-1d0d8ae7844a",
                  "comments": "Take after meals"
                },
                {
                  "id": "c1f77c60-5f7e-11ec-bf63-0242ac130005",
                  "dosage": "250mg",
                  "period": 14,
                  "batchId": "batch-002",
                  "quantityPrescribed": 60,
                  "quantityDispensed": 60,
                  "servedInternally": false,
                  "orderableId": "167ee72e-04a4-4f97-bcd9-4365015fd157",
                  "substituteOrderableId": null,
                  "comments": "Take before bed"
                }
              ]
            }
            // var payload = {
            //     "facilityId": patientInfo.homeFacility,
            //     "personDto": {
            //         "nationalId": patientInfo.nationalID,
            //         "firstName": patientInfo.firstName,
            //         "lastName": patientInfo.lastName,
            //         "nickName": patientInfo.nickName,
            //         "sex": patientInfo.sex,
            //         "dateOfBirth": patientInfo.DOB,
            //         "isDobEstimated": patientInfo.isDobEstimated,
            //         "physicalAddress": patientInfo.physicalAddress,
            //         "nextOfKinFullName": patientInfo.nextOfKinNames,
            //         "nextOfKinContact": patientInfo.nextOfKinContact,
            //         "motherMaidenName": patientInfo.motherMaidenName,
            //         "deceased": patientInfo.deceased,
            //         "retired": patientInfo.retired,
            //         "contacts": [
            //             {
            //                 "contactType": patientInfo.contact.contactType,
            //                 "contactValue": patientInfo.contact.contactValue
            //             }
            //         ]
            //     },
            //     "medicalHistory": [
            //         {
            //             "type": "Diagnosis",
            //             "history": "Diagnosed with letsoejane."
            //         },
            //         {
            //             "type": "Treatment",
            //             "history": "O sebelisa hloella-hape (iphinde futhi)."
            //         }
            //     ]
            // }
            return resource.postPrescriptionEvent(prescriptionDetails).$promise;
        }

    }
})();