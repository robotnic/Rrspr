angular.module("avatar",[])
.factory("avatarFactory",function($q,$http){
    var users={}  //memory leak vs. caching
    return {
        avatar:function(id){
            var q=$q.defer();
            if(users[id]){
                q.resolve(users[id]);
            }else{
                //users[id]={"loading":true};
                $http.get("/user/"+id,{cache:true}).then(function(response){
                    q.resolve(response.data);
                    users[response.data.id]=response.data;
                },function(error){
                    console.log(error);
                });
            }
            return q.promise;

        }


    }
})
.directive("avatar",function(){
    return {
        restrict: 'E',
        transclude: false,
        scope: {
            userid: '=userid',
            type: '=type'
        },
        templateUrl: 'modules/avatar/template.tpl.html',
        controller:function($scope,avatarFactory){
            $scope.url=avatarFactory.avatar($scope.userid).then(function(user){
                $scope.user=user;
            });
        }
    };
});
