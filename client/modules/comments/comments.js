angular.module("commentinger",[])
.directive("comments",function(){
    return {
        templateUrl:"modules/comments/template.tpl.html",
        controller:"channelController",
        scope:{
            resource:"="
        }
    }
})

