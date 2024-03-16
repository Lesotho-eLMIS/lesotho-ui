angular.module('requisition-redistribution')
    .controller('RequisitionRedistributionController', ['supplyingFacilities','$scope','stateTrackerService','$stateParams',
                'requisition','user','facility','facilities','program','processingPeriod','orderCreateService', 'notificationService',
                function (supplyingFacilities, $scope, stateTrackerService, $stateParams, requisition, user, facility, facilities, program, processingPeriod, 
                          orderCreateService, notificationService) {

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
        vm.createProcessAndSendOrder = createProcessAndSendOrder;
        vm.redistributeRequisition = redistributeRequisition;
        vm.submitOrders = submitOrders;
        
        function onInit() {
           vm.facility = facility;
           vm.supplyingFacilities = supplyingFacilities.filter(item => item.type.code === "health_center" || item.type.code === "hospital"); //facilities;
           vm.program = program;
           vm.processingPeriod = processingPeriod;
           vm.requisitionLineItems = requisition.requisitionLineItems;
           vm.redistributedRequisition = angular.copy(requisition);//Keep the requisition copy for processing in redistributeRequisition
           vm.requisitionType = 'requisitionView.emergency';
           vm.requisitionTypeClass = 'emergency';
           // Starting Each Row with Add Row Button Visible
           vm.requisitionLineItems.forEach(item => {
            item.addRowButton = true;
           });
        }

        function submitRedistribution () {
            let request = requisition;
            let orderLineItems = [];
            vm.requisitionLineItems.forEach(lineItem => {
                const order = {
                    emergency: true,
                    createdBy: { id: user.id },
                    program: { id: program.id },
                    requestingFacility: { id: facility.id },
                    receivingFacility: { id: facility.id },
                    supplyingFacility: { id: lineItem.supplyingFacility.id },
                    facility: { id: facility.id }
                };
                orderLineItems.push(order); 
            });
            let requestedItems = vm.requisitionLineItems;
            submitOrders(requestedItems, orderLineItems );
        }

       
        function submitOrders(requisitionItems, orderItems) {
            let orderLineItems = orderItems;
            while (orderLineItems.length > 0) {
                let supplyingFacilityId = orderLineItems[0].supplyingFacility.id;
                let ordersArray = orderLineItems.filter((lineItem) => lineItem.supplyingFacility.id === supplyingFacilityId);
                orderLineItems = orderLineItems.filter(item => !ordersArray.includes(item));
                let requestedItems = requisitionItems.filter((lineItem) => lineItem.supplyingFacility.id === supplyingFacilityId);
                if (ordersArray.length > 0) {
                    let ordersForProcessing = ordersArray;
                    let order = ordersForProcessing[0];
                    createProcessAndSendOrder(order, requestedItems);
                }
            }
            redistributeRequisition();
        }

        function createProcessAndSendOrder(order, requestedItems) {
            orderCreateService.create(order)
                .then((createdOrder) => {
                    return orderCreateService.get(createdOrder.id);
                })
                .then((fetchedOrder) => {
                    requestedItems.forEach((lineItem) => {
                        fetchedOrder.orderLineItems.push({                                    
                            orderable: lineItem.orderable,
                            orderedQuantity: lineItem.quantityToIssue,
                            soh: 45
                        });
                    });                  
                    return orderCreateService.send(fetchedOrder);
                })
                .then(() => {
                    notificationService.success('Successfully submitted.');
                    console.log('Order Sent');
                })
                .catch((error) => {
                    console.error('Error processing order:', error);
                });
        }

        function redistributeRequisition() {
          
            vm.requisition = angular.copy(vm.redistributedRequisition);
                vm.requisition .extraData = { isRedistributed: true };
                     return vm.requisition .$save()
                        .then(() => vm.requisition .$approve()
                            .then(() => stateTrackerService.goToPreviousState('openlmis.requisitions.approvalList')));
        }      
       
       vm.showAddButton = function(index) {           
            var sum = 0;
            var approvedQuantity = vm.requisitionLineItems[index].approvedQuantity;
            
            for (var i = 0; i < vm.requisitionLineItems.length; i++) {
                if(vm.requisitionLineItems[index].orderable.productCode === vm.requisitionLineItems[i].orderable.productCode){
                    sum += vm.requisitionLineItems[i].quantityToIssue;
                    if (sum >= approvedQuantity) {
                        console.log("INDEX:  " + i + "| |" + index);
                        vm.requisitionLineItems.forEach(item => {

                        if(vm.requisitionLineItems[index].orderable.productCode === item.orderable.productCode)
                            {
                                item.addRowButton = false;
                            }
                        });
                    }
                    else if (sum < approvedQuantity){
                        vm.requisitionLineItems.forEach(item => {
                            item.addRowButton = true;
                        });
                    }
                }

            }
            vm.requisitionLineItems[index].addRowButton = true;
        };
    
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
        vm.removeLineItem = function (index) {
            vm.requisitionLineItems.splice(index, 1);
        }
        

    }]);