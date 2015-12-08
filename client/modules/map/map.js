angular.module("map",['leaflet-directive'])
.directive("map",function(){
    return {
        templateUrl:"modules/map/template.tpl.html",
        controller:"mapController",
        scope:{
            resource:"="
        }
    }
})

.controller('mapController', ['$scope','$controller', function ($scope,$controller) {
  $controller('channelController', { $scope: $scope });
    console.log("inside map controller");


     angular.extend($scope, {

        center: {
            lat: 52.374004,
            lng: 4.890359,
            zoom: 7
        },
        defaults: {
            scrollWheelZoom: false
        },
        events: {
            map: {
                enable: [ 'click'],
                logic: 'emit'
            }
        },
        geojson : {
            data: {
                type:"FeatureCollection",
                features:[]
            },
            onEachFeature: function (feature, layer) {
                console.log("im each");
                layer.setIcon(defaultMarker);
            },
pointToLayer: function(feature, latlng) {
        console.log("gewonnen");
        return new L.circleMarker(latlng, {radius:6,fill:"red"})
    }
        }
    });
    $scope.update=function(){
        /*
        var defaultMarker = L.AwesomeMarkers.icon({
            icon: 'play',
            markerColor: 'darkblue'
        });
        */
        var fc={
            type:"FeatureCollection",
            features:[]
        }
        for(var i=0;i< $scope.items.length;i++){
                    $scope.items[i].geojson.opacity=1-i/10;
                    fc.features.push($scope.items[i].geojson);
        }


        console.log("something happend",fc);
        angular.extend($scope, {
            geojson: {
                data: fc,
                onEachFeature: function (feature, layer) {
                    console.log(feature,layer);
                    console.log(layer);
                    //layer.setIcon(defaultMarker);
                    //layers[feature.properties.id] = layer;
                    //console.log(layers);
                },
                pointToLayer: function (feature, latlng) {
                    console.log("odch");
                    return L.circleMarker(latlng, {
                        radius: 8,
                        fillColor: "#ff7800",
                        color: "#000",
                        weight: 1,
                        opacity: feature.opacity,
                        fillOpacity: feature.opacity
                    });
                }
            }
        })
        //$scope.$apply();
        console.log($scope.geojson); 
    }



     $scope.$on('leafletDirectiveMap.click', function(event,levent){
        console.log("click",levent);
        var latlng=levent.leafletEvent.latlng;
        console.log("latlng",latlng);
        var feature={
            type:"Feature",
            geometry:{
                type:"Point",
                coordinates:[latlng.lng,latlng.lat]
            }
        }
        console.log(feature);
        $scope.post({"geojson":feature});
    });
    $scope.center.lat=48.2;
    $scope.center.lng=16.3;
}]);
