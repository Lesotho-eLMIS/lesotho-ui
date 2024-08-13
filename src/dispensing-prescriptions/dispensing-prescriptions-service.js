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

(function () {

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

  prescriptionsService.$inject = ['$resource', 'openlmisUrlFactory', 'notificationService', 'confirmService', 'openlmisModalService'];

  function prescriptionsService($resource, openlmisUrlFactory, notificationService, confirmService, openlmisModalService) {

    // var promise,
    //     POD_FACILITIES = 'dispensingPatientsFacilities';
    // Using Resource to Communicate with dispensing Endpoints

    var resource = $resource(openlmisUrlFactory('api/prescription:id'), {}, {
      getAll: {
        url: openlmisUrlFactory('api/prescription'),
        method: 'GET',
        isArray: true
      },
      // getPatient: {
      //   url: openlmisUrlFactory('api/patient'),
      //   method: 'GET',
      //   isArray: true
      // }, 
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
        // params: { id: '@id' }
      },
      getProductsWithSOH: {
        url: openlmisUrlFactory('/api/v2/allStockCardSummaries'),
        method: 'GET',
        params: { facilityId: '@facilityId' }
      },
      getAllFacilityProducts: {
        url: openlmisUrlFactory('/api/requisitions/approvedProducts'),
        method: 'GET',
        isArray: true,
        params: { facilityId: '@facilityId' }
      },
      updatePrescriptionEvent: {
        url: openlmisUrlFactory('/api/prescription/:id'),
        method: 'PUT'
      },
    });


    this.createPrescription = createPrescription; // To post Prescription paylodad
    this.getPrescriptions = getPrescriptions; //To retrieve a Prescription record from the database
    this.getPrescription = getPrescription;
    this.getProductsWithSOH = getProductsWithSOH;
    this.servePrescription = servePrescription;
    this.getAllFacilityProducts = getAllFacilityProducts;
    this.updatePrescription = updatePrescription;

    function getProductsWithSOH(facilityId) {
      var params = { facilityId: facilityId };
      return resource.getProductsWithSOH(params).$promise;
    }

    function getAllFacilityProducts(facilityId) {
      var params = { facilityId: facilityId };
      return resource.getAllFacilityProducts(params).$promise;
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
    function getPrescriptions(prescriptionParams) {
      var params = {
        patientNumber: prescriptionParams.patientNumber,
        status: prescriptionParams.status,
        firstName: prescriptionParams.firstName,
        lastName: prescriptionParams.lastName,
        followUpDate: prescriptionParams.followUpDate,
        nationalId: prescriptionParams.nationalId,
        contactNumber: prescriptionParams.contactNumber
      };

      return resource.getAll(params).$promise.then(function (response) {
        //Transforming the response to an object if it's an array
        if (Array.isArray(response)) {
          var objectOfPrescriptions = response.reduce((result, obj) => {
            result[obj.id] = obj;

            return result;
          }, {});
          return objectOfPrescriptions;
        }
        return response;
      });
    };

    function getPrescription(prescriptionIdId) {
      var params = { id: prescriptionIdId };
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
    function createPrescription(prescriptionDetails) {

      var prescriptionData = {
        patientId: prescriptionDetails.patientId,
        patientType: prescriptionDetails.patientType ? "In-Patient" : "Out-Patient",
        followUpDate: prescriptionDetails.followUpDate,
        issueDate: "2024-07-07",
        createdDate: prescriptionDetails.createdDate,
        capturedDate: prescriptionDetails.createdDate,
        lastUpdate: "2024-07-07",
        isVoided: false,
        status: "INITIATED",
        facilityId: prescriptionDetails.facilityId,
        userId: prescriptionDetails.userId,
        lineItems: prescriptionDetails.lineItems
      }
      return resource.postPrescriptionEvent(prescriptionData);
    }

    function servePrescription(prescriptionDetails) {
      var params = { id: prescriptionDetails.prescriptionId };

      var prescriptionData = {
        patientId: prescriptionDetails.patientId,
        patientType: prescriptionDetails.patientType ? "Outpatient" : "Inpatient",
        followUpDate: prescriptionDetails.followUpDate,
        issueDate: prescriptionDetails.issueDate,
        createdDate: prescriptionDetails.createdDate,
        capturedDate: prescriptionDetails.createdDate,
        lastUpdate: "2024-07-07",
        isVoided: false,
        status: prescriptionDetails.status,
        facilityId: prescriptionDetails.facilityId,
        prescribedByUserId: prescriptionDetails.prescribedByUserId,
        servedByUserId: prescriptionDetails.servedByUserId,
        lineItems: prescriptionDetails.lineItems
      }

      return resource.serve(params, prescriptionData);
    }

    function updatePrescription(prescriptionDetails) {
      console.log("Editing Prescription", prescriptionDetails);
      return resource.updatePrescriptionEvent({ id: prescriptionDetails.id }, prescriptionDetails).$promise;
    }
  }
})();