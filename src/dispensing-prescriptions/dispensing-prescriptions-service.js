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
        function getPrescriptions() {

            return resource.getAll().$promise.then(function(response) {
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
               return response; 
             });
        };

        function getPrescription(){
          var params ={id: "e8d1085f-cca0-49c1-9115-bf24a88560cc"};
          return resource.get(params).$promise.then(function(response) {
            //Transforming the response to an object if it's an array
                  console.log(response);
        })
      }
 
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
        // function createPrescription(prescriptionData){
            
        //     console.log(prescriptionData);
        //     return resource.postPrescriptionEvent(prescriptionData).$promise
        //     .then(function(response){
        //       console.log("SSXERCCC", response);
        //       return response;
        //     });
        // }

        function createPrescription(prescriptionData) {
          console.log(prescriptionData);
          return resource.postPrescriptionEvent(prescriptionData).$promise
              .then(function(response) {
                  console.log("Response:", response);
                  return response;
              })
              .catch(function(error) {
                  console.error("Error:", error);
                  throw error;  // Re-throw the error to be caught in the controller
              });
      }

        function prescriptionLineItems(prescriptionDetails){

          var lineItems = [];
          prescriptionDetails.forEach(element => {
            var item = {
              // "id": "c1f77c60-5f7e-11ec-bf63-0242ac130004",
              "dosage": element.dose, // "500mg", [string1, string2].join('');
              "period": element.duration, // 7,
              "batchId": element.batchNumber, // "batch-001",
              "quantityPrescribed": element.quantityPrescribed, // 30,
              "quantityDispensed": element.quantityDispensed, // 30,
              "servedInternally": element.isInternallyServed, // true,
              "orderableId": element.orderableId, // "167ee72e-04a4-4f97-bcd9-4365015fd157",
              // "substituteOrderableId": "dbaa07c0-66cd-43ed-9272-1d0d8ae7844a",
              "comments": element.comments // "Take after meals"
            };
          
            lineItems.push(item);
          });
          console.log('=======++++++++++++++==========');
          console.log(lineItems);
          return lineItems;
        }

    }
})();