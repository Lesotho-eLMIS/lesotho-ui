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
                getAll: {
                    url: openlmisUrlFactory('api/prescription'),
                    method: 'GET',
                    isArray: true
                }, 
                getPatient: {
                  url: openlmisUrlFactory('api/patient'),
                  method: 'GET',
                  isArray: true
                }, 
                postPrescriptionEvent: {
                    url: openlmisUrlFactory('api/prescription'),
                    method: 'POST'
                },
                get: {
                  url: openlmisUrlFactory('/api/prescription/:id'),
                  method: 'GET'
                },
                serve: {
                  url: openlmisUrlFactory('/api/prescription/:id/serve'),
                  method: 'POST'
                },
                getProductsWithSOH: {
                  url: openlmisUrlFactory('/api/v2/allStockCardSummaries'),
                  method: 'GET'
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
        this.getPrescriptions = getPrescriptions; //To retrieve a Prescription record from the database
        this.getPrescription = getPrescription;
        this.prescriptionLineItems = prescriptionLineItems;
        this.getProductsWithSOH =  getProductsWithSOH;
        this.servePrescription = servePrescription;
        
        function getProductsWithSOH(facilityId) {
          var params ={facilityId: facilityId}
          resource.getProductsWithSOH(params)
        }    

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
        function getPrescriptions(patientParams) {
          
            var params = {
                patientNumber: patientParams.patientNumber,
                firstName: patientParams.firstName,
                // lastName: patientParams.lastName,
                // dateOfBirth: patientParams.dateOfBirth,
                nationalId: patientParams.nationalId,
                // facilityId:patientParams.facilityId,
                // PrescriptionStatus: 'INITIATED'
            };
            console.log("Prescription Service");
            console.log(params);
            console.log("1 ###################");
            return resource.getAll(params).$promise.then(function(response) {
                //Transforming the response to an object if it's an array
                    if (Array.isArray(response)) {
                      console.log("got it!!!!!!!!");
                      console.log(response);
                                    
                        var objectOfPatients = response.reduce((result, obj) => {
                        result[obj.id] = obj;
                       
                        return result;
                        }, {});                        
                        return objectOfPatients;                         
                    }
                    console.log("###################");
                    return response; 
             });
        };

        function getPrescription(prescriptionIdId){
          var params ={id: prescriptionIdId};
          return resource.get(params);
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
        function createPrescription(prescriptionDetails){
            
           var prescriptionData = {
              "patientId": prescriptionDetails.patientId,//"22326e87-08ad-48d4-ab61-fc76c268e891",
              "patientType": prescriptionDetails.patientType ? "Outpatient" : "Inpatient",
              "followUpDate": prescriptionDetails.followUpDate,//"2024-07-14",
              "issueDate": "2024-07-07",
              "createdDate": prescriptionDetails.createdDate,//"2024-07-07",
              "capturedDate": prescriptionDetails.createdDate,//"2024-07-07",
              "lastUpdate": "2024-07-07",
              "isVoided": false,
              "status": "INITIATED",
              "facilityId": prescriptionDetails.facilityId,
              "userId": prescriptionDetails.userId,
              "lineItems": prescriptionLineItems("create", prescriptionDetails)
            }
            console.log(prescriptionData);
            return resource.postPrescriptionEvent(prescriptionData);
        }

        function prescriptionLineItems(mode ,prescriptionDetails){

          var lineItems = [];
          if(mode === "serve"){
            prescriptionDetails.forEach(element => {
              var item = {
                // "id": "c1f77c60-5f7e-11ec-bf63-0242ac130004",
                "dose": element.Dispense.dose, // "500mg", [string1, string2].join('');
                "doseUnits": element.Dispense.doseUnit,
                "doseFrequency": element.Dispense.doseFrequency,
                "route": element.Dispense.doseRoute,
                "duration": element.Dispense.duration, //[0].Dispense.duration
                "durationUnits": element.Dispense.durationUnit,
                "additionalInstructions": element.Dispense.instruction,
                "orderablePrescribed": element.orderablePrescribed,
                "status": "PARTIALLY_SERVED",
                "orderableDispensed": element.orderablePrescribed,// Temporarily
                "lotId": element.lot.id,                       
                "period": element.duration, // 7,
                "batchId": element.batchNumber, // "batch-001",
                "quantityPrescribed": element.quantityPrescribed, // 30,
                "quantityDispensed": element.Dispense.quantityDispensed, // 30,
                "servedExternally": element.Dispense.isInternallyServed, // true,
                "orderableId": element.orderablePrescribed, // "167ee72e-04a4-4f97-bcd9-4365015fd157",
                // "substituteOrderableId": "dbaa07c0-66cd-43ed-9272-1d0d8ae7844a",
                "remainingBalance":  element.Dispense.quantityDispensed ? element.quantityPrescribed - element.Dispense.quantityDispensed : element.quantityPrescribed,
                "comments": element.comments // "Take after meals"
              };
              lineItems.push(item);
            });
          }else{
            prescriptionDetails.forEach(element => {
              var item = {
                // "id": "c1f77c60-5f7e-11ec-bf63-0242ac130004",
                "dosage": element.dose, // "500mg", [string1, string2].join('');
                "period": element.duration, // 7,
                "batchId": element.batchNumber, // "batch-001",
                "quantityPrescribed": element.quantityPrescribed, // 30,
                "quantityDispensed": element.quantityDispensed, // 30,
                "servedInternally": element.isInternallyServed, // true,
                "remainingBalance":element.quantityPrescribed,
                "orderableId": element.orderableId, // "167ee72e-04a4-4f97-bcd9-4365015fd157",
                // "substituteOrderableId": "dbaa07c0-66cd-43ed-9272-1d0d8ae7844a",
                "comments": element.comments // "Take after meals"
              };
            
              lineItems.push(item);
            });
          }
          
          console.log('=======++++++++++++++==========');
          console.log(lineItems);
          return lineItems;
        }
        

        function servePrescription(prescriptionDetails) {
          var params ={id:prescriptionDetails.prescriptionId}; //"004d3fe9-c784-4681-8446-5113429d4bb7"};//
          var prescriptionData = {
            "patientId": prescriptionDetails.patientId,//"22326e87-08ad-48d4-ab61-fc76c268e891",
            "patientType": prescriptionDetails.patientType ? "Outpatient" : "Inpatient",
            "followUpDate": prescriptionDetails.followUpDate,//"2024-07-14",
            "issueDate": "2024-07-07",
            "createdDate": prescriptionDetails.createdDate,//"2024-07-07",
            "capturedDate": prescriptionDetails.createdDate,//"2024-07-07",
            "lastUpdate": "2024-07-07",
            "isVoided": false,
            "status": "FULLY_SERVED",
            "facilityId": prescriptionDetails.facilityId,
            "userId": prescriptionDetails.userId,
            "prescribedByUserId": prescriptionDetails.userId,
            "servedByUserId": prescriptionDetails.userId,
            "lineItems": prescriptionLineItems("serve", prescriptionDetails)
          }
          console.log(prescriptionData);
          return resource.serve(params, prescriptionData);
        }
    }
})();