var CHAT=null;
angular.module("chatapp",['btford.socket-io','ngMaterial','ngAnimate',"restangular",'angularMoment',"avatar","rest",'ui.router','forms','comm','bloginger','commentinger','jsonFormatter','p2p','apidoc','map','config'])
.factory('mysocket', function (socketFactory) {
  return socketFactory();
})
.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/blog");
  //
  // Now set up the states
  $stateProvider
    .state('intro', {
      url: "/doc/intro",
      templateUrl: "doc/intro.html"
    })
    .state('state1.list', {
      url: "/list",
      templateUrl: "doc/intro.html",
      controller: function($scope) {
        $scope.items = ["A", "List", "Of", "Items"];
      }
    })
    .state('blog', {
      url: "/blog?resource",
      templateUrl: "views/blog.html",
        controller:function($scope,$stateParams){
            console.log($stateParams.resource);
            $scope.resource=$stateParams.resource;
            if(!$scope.resource){
                $scope.resource="users/"+$scope.user.id+"/public/blog";
                $scope.userid=$scope.user.id;
            }

        }
    })
 
    .state('profile', {
      url: "/profile?userid",
      templateUrl: "views/profile.html" ,
        controller:function($scope,$stateParams){
            console.log($stateParams.userid);
            $scope.resource="users/"+$stateParams.userid+"/public/profile";
            if(!$scope.resource){
                $scope.resource="users/"+$scope.user.id+"/public/profile";
            }

            $scope.userid=$stateParams.userid;
            if(!$scope.userid){
                $scope.userid=$scope.user.id;
            }


        }

    })
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html"
    })
    .state('contacts', {
      url: "/contacts",
      templateUrl: "views/contacts.html"
    })
    .state('map', {
      url: "/map?resource",
      templateUrl: "views/map.html" ,
        controller:function($scope,$stateParams){
            console.log($stateParams.resource);
            $scope.resource=$stateParams.resource;
            if(!$scope.resource){
                $scope.resource="users/"+$scope.user.id+"/public/geojson";
            }
        }

    })
 
    .state('config', {
      url: "/config",
      templateUrl: "views/config.html"
    })
 

    .state('api', {
      url: "/doc/api",
      templateUrl: "views/api.html",
      controller: function($scope) {
        $scope.things = ["A", "Set", "Of", "Things"];
      }
    });
})




.controller("page",function($scope,$rootScope,$http,mysocket,$mdDialog,Restangular){
    CHAT=$scope;
    $scope.feeds={};

    $http.get("/auth/user").then(function(response){
        $scope.user=response.data;
        $rootScope.rrspr_user=response.data;
    });
    $http.get("/resources").then(function(response){
        $scope.resources=response.data;
    });



    //todo: this is a normal rest interface - change that
    $scope.addContact=function(id){
        console.log("add contact", id);

        //post to /user/666/contacts
        var request={
            method:"post",
            url:"/users/"+$scope.user.id+"/contacts",
            data:{contact:id,following:true}
        }
        $http(request).then(function(response){
            console.log(response);
        });
    };

})


