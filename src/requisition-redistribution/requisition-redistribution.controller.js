angular.module('requisition-redistribution')
    .controller('RequisitionRedistributionController', ['$scope','requisition', function ($scope, requisition) {

        vm = this;

        vm.$onInit = onInit;
        //vm.goToRedistribution = goToRedistribution;
        vm.requisition = requisition;

        
        function onInit() {
           console.log(vm.requisition);
        }
        

    }]);