angular.module("forms",[])
.directive("profile",function(){
    return {
        templateUrl:"modules/profile/template.tpl.html",
        controller:"channelController",
        scope:{
            resource:"=",
            userid:"="
        }
    }
})
