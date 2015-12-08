angular.module("config",[])
.directive("configform",function(){
    return {
        templateUrl:"modules/config/template.tpl.html",
        controller:"channelController",
        scope:{
            resource:"=",
            userid:"="
        }
    }
})
