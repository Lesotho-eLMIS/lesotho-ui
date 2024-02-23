angular.module('requisition-redistribution')
    .controller('RequisitionRedistributionController', ['supplyingFacilities','$scope','stateTrackerService','$stateParams','requisition','user','facility','facilities','program','processingPeriod','orderCreateService', function (supplyingFacilities, $scope, stateTrackerService, $stateParams, requisition,user,facility,facilities,program,processingPeriod,orderCreateService) {

        vm = this;

        vm.$onInit = onInit;
        vm.requisition = requisition;
        vm.requisitionLineItems = undefined;
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
        vm.supplyingFacilities = undefined;
        vm.submitRedistribution = submitRedistribution; 
      //  vm.createOrder = createOrder;
        
        function onInit() {
          // console.log(requisition);
          // console.log(facilities); 
           //console.log(facility.type); 
           //console.log(program);
           //console.log(supplyingFacilities);
           vm.facility = facility;
           vm.supplyingFacilities = supplyingFacilities.filter(item => item.type.code === "health_center" || item.type.code === "hospital"); //facilities;
           //console.log(vm.supplyingFacilities);
           vm.program = program;
           vm.processingPeriod = processingPeriod;
           vm.requisitionLineItems = requisition.requisitionLineItems;
           vm.requisitionType = 'requisitionView.emergency';
           vm.requisitionTypeClass = 'emergency';
           // Starting Each Row with Add Row Button Visible
           vm.requisitionLineItems.forEach(item => {
            item.addRowButton = true;
           });
        }

        function submitRedistribution(){

            for(var i = 0; i < vm.requisitionLineItems.length; i++){

                //build the order object
                const order = {
                    emergency: true,
                    createdBy: { id: user.id },
                    program: { id: program.id },
                    requestingFacility: { id: facility.id },
                    receivingFacility: { id: facility.id },
                    supplyingFacility: { id: vm.requisitionLineItems[i].supplyingFacility.id },
                    facility: { id: facility.id }
                }; 

                //create and Order
                orderCreateService.create(order).then((createdOrder) => {
                    
                 //Get the order we just created
                 orderCreateService.get(createdOrder.id)
                     .then((fetchedOrder) => {

                        console.log(fetchedOrder); 

                        //get requisition line items of the same supplying facility to build order line items
                        var ordersArray = [];
                        ordersArray = vm.requisitionLineItems.filter((lineItem) => lineItem.supplyingFacility.id === fetchedOrder.supplyingFacility.id);
                        
                         //Push LineItems into the order object.
                         console.log(ordersArray);

                         ordersArray.forEach((lineItem) => {fetchedOrder.orderLineItems.push({orderable : lineItem.orderable, orderedQuantity : lineItem.quantityToIssue, soh: 45
                        });                         
                      });
                         //Send the order with lineItems
                         orderCreateService.send(fetchedOrder)
                             .then(() => {
                                 console.log('Order Sent')
                             });
                     });
             });
            }
            //Mark Current requisition as redistributed
            vm.requisition.extraData = {isRedistributed: true};
            vm.requisition.$save().then(function() {
                vm.requisition.$approve().then(function() {
                    stateTrackerService.goToPreviousState('openlmis.requisitions.approvalList');
                });
            });

        }
            
            
            // vm.requisitionLineItems.forEach((lineItem)=>{

            //     console.log("lineItem");

            //     const order = {
            //         emergency: true,
            //         createdBy: { id: user.id },
            //         program: { id: program.id },
            //         requestingFacility: { id: facility.id },
            //         receivingFacility: { id: facility.id },
            //         supplyingFacility: { id: lineItem.supplyingFacility.id },
            //         facility: { id: facility.id }
            //     }; 
                
                
                
          //  }); 
            
            //  //Create an order
            //  orderCreateService.create(order)
            //  .then((createdOrder) => {
            //      //Get the order we just created
            //      orderCreateService.get(createdOrder.id)
            //          .then((fetchedOrder) => {
            //              console.log(fetchedOrder); 
            //              //Push LineItems into the order object.
            //              console.log(lineItem);
            //              fetchedOrder.orderLineItems.push({orderable : lineItem.orderable, orderedQuantity : lineItem.quantityToIssue, soh: 45
            //                  });
            //              //Send the order with lineItems
            //              orderCreateService.send(fetchedOrder)
            //                  .then(() => {
            //                      console.log('Order Sent')
            //                  });
            //          });
            //  });
     

        // function createOrder(order){

        //      //Create an order
             
        // }

        
       vm.showAddButton = function(index) {
           
            var sum = 0;
            var approvedQuantity = vm.requisitionLineItems[index].approvedQuantity;
            
            for (var i = 0; i < vm.requisitionLineItems.length; i++) {
                if(vm.requisitionLineItems[index].orderable.productCode === vm.requisitionLineItems[i].orderable.productCode){
                    sum += vm.requisitionLineItems[i].quantityToIssue;
                    if (sum >= approvedQuantity) {
                        console.log("INDEX:  " + i + "| |" + index);
                        vm.requisitionLineItems.forEach(item => {

                           // item.addRowButton = vm.requisitionLineItems[index].orderable.productCode === item.orderable.productCode ? false : item.addRowButton;

                            if(vm.requisitionLineItems[index].orderable.productCode === item.orderable.productCode)
                            {
                                item.addRowButton = false;
                            }
                        });
                        console.log(sum + " |if ONLY| " + approvedQuantity); 
                      //  sum = 0;
                      //  return; 
                    }
                    else if (sum < approvedQuantity){
                        vm.requisitionLineItems.forEach(item => {
                            item.addRowButton = true;
                            //item.addRowButton = vm.requisitionLineItems[index].orderable.productCode === item.orderable.productCode ? true : item.addRowButton;
                        });
                        console.log(sum + " |else| " + approvedQuantity); 
                        //vm.requisitionLineItems[i].addRowButton = false; 
                        //vm.addRowButton = false;
                       // sum = 0;
                        //return; 
                    }
                }

            }
        
            //console.log(sum + " || " + approvedQuantity);          
            // If the loop completes without meeting the condition, show the button
            vm.requisitionLineItems[index].addRowButton = true;
        };

       // $scope.removeSelectedFacility: if a facility has already been chosen as a supplier for this line item.
        // remove it from the pool 
    
        vm.addRow = function(index, item) {
            // Create a new item object with default values
            var newLineItem = angular.copy(item);

            newLineItem.supplyingFacility = null;
            newLineItem.quantityToIssue = 0;
            newLineItem.remarks = '';
            newLineItem.addRowButton = true;
        
            // Insert the new item into the array at the specified index
            vm.requisitionLineItems.splice(index + 1, 0, newLineItem);
        };

        /////REMOVE LINE ITEM FROM REDISTRIBUTION TABLE
        // vm.removeLineItem = function (index) {
        //     vm.requisitionLineItems.splice(index, 1);
        // }
        

    }]);