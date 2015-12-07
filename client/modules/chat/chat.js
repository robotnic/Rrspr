angular.module("comm",[])
.directive("chat",function(){
    return {
        templateUrl:"modules/chat/template.tpl.html",
        controller:"channelController",
        scope:{
            resource:"="
        }
    }
})
