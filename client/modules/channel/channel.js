var CHANNEL   //Debug
angular.module("rest",[])
.directive("channel",function(){
    return {
        templateUrl:"modules/channel/template.tpl.html",
        controller:"channelController",
        scope:{
            resource:"="
        }
    }
})
.controller("channelController",function($scope,$rootScope,$http,$filter,mysocket,$mdDialog,Restangular,$timeout){
    CHANNEL=$scope;
    $scope.items=[];

    // SOCKET
    mysocket.on("message",function(message){
        if(message.old_val){
            $scope.items = $scope.items.filter(function (item) {
                return (item.id !== message.old_val.id);
            });
        };
        if(message.new_val){
            //Bottelneck - at the moment everting is broadcasted and filtered client side - which will not work in big groups
            console.log("RESOURCE","/"+$scope.resource,message.new_val.resource);

            if("/"+$scope.resource==message.new_val.resource){
                var newitem=Restangular.restangularizeElement('', message.new_val, $scope.resource)
                $scope.items.unshift(newitem);
                $scope.items=sortByKey($scope.items,"created");
            }
        }
        if($scope.update){
            $scope.update();
        }
    })


    // REST
    function startBlog(resource){
        $scope.resource=resource;
        var channel = Restangular.all(resource)
        channel.getList().then(function(items){
            $scope.items=sortByKey(items,"created");
            R=items;
            if($scope.update){
                $scope.update();
            }
        });
        $scope.post = function(item) {
            console.log("post",item);
            var clone=angular.copy(item);
            channel.post(item).then(function(newResource){
                    item.body="";

                    //remove unconfirmed placeholder of posted item
                    var index = $scope.items.indexOf(clone);
                    $scope.items.splice(index, 1); 
            },function(error){
                clone.rrspr_status="error";
                $timeout(function(){
                    var index = $scope.items.indexOf(clone);
                    $scope.items.splice(index, 1);
                },2000); 
            })
            if($rootScope.rrspr_user){
                clone.owner=$rootScope.rrspr_user.id;
            }
            clone.rrspr_status="loading";
            $scope.items.push(clone);
        }


    } 
    // Here we go
    startBlog($scope.resource);


    // Helper function
    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var y = a[key]; var x = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }


})


