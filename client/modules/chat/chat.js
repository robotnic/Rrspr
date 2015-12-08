angular.module("comm",['luegg.directives'])
.directive("chat",function(){
    return {
        templateUrl:"modules/chat/template.tpl.html",
        controller:"channelController",
        scope:{
            resource:"="
        }
    }
})
