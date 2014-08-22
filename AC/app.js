/**
 * Created by ssp on 10/8/2014.
 */
var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope,Pusher,$http) {


if(navigator.geolocation){
    navigator.geolocation.watchPosition(function(position){
        $scope.$apply(function(){
            $scope.position=position;
            $http.post('/api/coordinates',position);
        })
    })
}

$scope.$watch('position',function(newValue,oldValue){
      console.log(oldValue);
      //$http.post('/api/coordinates',oldValue);
  })

    $scope.name = 'World';
    $scope.fanspeeds={
        low:"low",
        medium:"medium",
        high:"high"
    };



    $scope.model={
        powerMode:'',
        temp:'',
        stemp:'25',
        select:'',
        radio:'',
        pwr:function(state){
            this.powerMode=state;
			if(state==="on"){
$http.get('/api/get/on');
		}
			else if(state==="off"){
		$http.get('/api/get/off');		
		}        
			},
        tempPlus:function(){
            this.stemp++;
        },
        tempMinus:function(){
            this.stemp--;
        }
    }




    Pusher.subscribe("test_channel","my_event",function(data){
        $scope.model.temp=data.temp;

        console.log(data);

    });


    $scope.$on('$destroy', function () {
        Pusher.unsubscribe('items');
        console.log('Unsubscribed from items');
        Pusher.unsubscribe('activities');
        console.log('Unsubscribed from activities');
    })



});
app.directive('flash',function(){
    return{
        restrict:'A',
        link:function(scope,elem,attrs){
            scope.$watch(function(){
                return scope.model.temp;
            },function(newValue,oldValue){
                console.log(newValue);
                $(elem).delay(200).fadeOut('slow').delay(50).fadeIn('slow');
            })




        }
    }
})


app.provider('PusherService', function () {
    var scriptUrl = 'http://js.pusher.com/2.2/pusher.min.js';
    var scriptId = 'pusher-sdk';
    var apiKey = '';
    var initOptions = {};

    this.setPusherUrl = function (url) {
        if(url) scriptUrl = url;
        return this;
    };

    this.setOptions = function (options) {
        initOptions = options || initOptions;
        return this;
    };

    this.setToken = function (token) {
        apiKey = token || apiKey;
        return this;
    };

    // load the pusher api script async
    function createScript ($document, callback, success ) {
        var tag = $document.createElement('script');
        tag.type = 'text/javascript';
        tag.async = true;
        tag.id = scriptId;
        tag.src = scriptUrl;

        tag.onreadystatechange = tag.onload = function () {
            var state = tag.readState;
            if (!callback.done && (!state || /loaded|complete/.test(state))) {
                callback.done = true;
                callback();
            }
        };

        $document.getElementsByTagName('head')[0].appendChild(tag);
    }

    this.$get = ['$document', '$timeout', '$q', '$rootScope', '$window', '$location',
        function ($document, $timeout, $q, $rootScope, $window, $location) {
            var deferred = $q.defer();
            var pusher;

            function onSuccess () {
                pusher = new $window.Pusher(apiKey, initOptions);
            }

            var onScriptLoad = function (callback) {
                onSuccess();
                $timeout(function () {
                    deferred.resolve(pusher);
                });
            };

            createScript($document[0], onScriptLoad);
            return deferred.promise;
        }];

})

    .factory('Pusher', ['$rootScope', 'PusherService',
        function ($rootScope, PusherService) {
            return {



                subscribe: function (channelName, eventName, callback) {
                    PusherService.then(function (pusher) {
                        var channel = pusher.channel(channelName) || pusher.subscribe(channelName);
                        channel.bind(eventName, function (data) {
                            if (callback) callback(data);
                            $rootScope.$broadcast(channelName + ':' + eventName, data);
                            $rootScope.$digest();
                        });
                    });
                },

                unsubscribe: function (channelName) {
                    PusherService.then(function (pusher) {
                        pusher.unsubscribe(channelName);
                    });
                }
            };
        }
    ]);
app.config(function(PusherServiceProvider) {
    PusherServiceProvider
        .setToken('599a9eb32ff37b5469f7')
       // .setOptions({authEndpoint: "http://localhost/ffs/pusher_auth.php"});
});
