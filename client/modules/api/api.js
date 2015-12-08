angular.module("apidoc",[])
.directive("api",function(){
    return {
        templateUrl:"modules/api/template.tpl.html",
        controller:"apiController",
        scope:{
            resources:"="
        }
    }
})
.controller("apiController",function($scope){
    $scope.secureMethods={
        "open":{color:"green",description:"logged in users are allowed to use this method"},
        "p2p":{color:"yellow",description:"'owner' or 'to' property must be userid of logged in user"},
        "owner":{color:"purple",description:"owner of a stanza"},
        "privat":{color:"red",description:"user with userid as in path :userid is allowed to use this method"},
        "admin":{color:"black",description:"admin only"}

    }
    $scope.commentResource=function(key){
        var resource="open/api/comments/"+btoa(key);
        console.log(resource);
        return resource;

    }
});
