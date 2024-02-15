angular.module('requisition-redistribution')
    .controller('RequisitionRedistributionController', ['$scope','$stateParams','requisition','user','facility','program','processingPeriod', function ($scope,$stateParams,requisition,user,facility,program,processingPeriod) {

        vm = this;

        vm.$onInit = onInit;
        vm.requisition = requisition;
        vm.program = undefined;
        vm.facility = undefined;
        vm.processingPeriod = undefined;
        vm.displaySubmitButton = undefined;
        vm.displaySubmitAndAuthorizeButton = undefined;
        vm.displayAuthorizeButton = undefined;
        vm.displayDeleteButton = undefined;
        vm.displayApproveAndRejectButtons = undefined;
        vm.displayRejectButton = undefined;
        vm.displaySkipButton = undefined;
        vm.displaySyncButton = undefined;
        vm.requisitionType = undefined;

        
        function onInit() {
           console.log(requisition);
           console.log(facility); 
           console.log(program);
           vm.facility = facility;
           vm.program = program;
           vm.processingPeriod = processingPeriod;
           vm.requisitionType = 'requisitionView.emergency';
           vm.requisitionTypeClass = 'emergency';
           
        }
        

    }]);