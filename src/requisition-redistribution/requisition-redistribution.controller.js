angular.module('requisition-redistribution')
    .controller('RequisitionRedistributionController', ['$scope','$stateParams','requisition', function ($scope,$stateParams,requisition) {

        vm = this;

        vm.$onInit = onInit;
        //vm.goToRedistribution = goToRedistribution;
        //vm.requisition = requisition;

        
        function onInit() {
           console.log(requisition);
        }
        

    }]);