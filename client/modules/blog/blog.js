angular.module("bloginger",[])
.directive("blog",function(){
    return {
        templateUrl:"modules/blog/template.tpl.html",
        controller:"channelController",
        scope:{
            resource:"="
        }
    }
})

