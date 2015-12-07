angular.module("p2p",[])
.directive("contacts",function(){
    return {
        templateUrl:"modules/contacts/template.tpl.html",
        controller:"contactController",
        scope:{
            resource:"="
        }
    }
})

.controller('contactController', ['$scope','$controller', function ($scope,$controller) {
  $controller('channelController', { $scope: $scope });
  $scope.addContact = function (userid) {
    $scope.post({userid:userid});
  };
}]);
