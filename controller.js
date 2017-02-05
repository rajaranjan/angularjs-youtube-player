var videos = [
            'V7HPQ6DVvug',
            'taSwS5rhtmc',
            'odqACn2Vgic'
        ];
var starts = [15,21,35];
var ends = [20,31,45];
var current = 0;
var title = '';
youApp.directive('youtube',function(videoData,$window, YT_event) {
  return {
    restrict: "E",
    scope: {
      videoid: "@",
      someCtrlFn: '&callbackFn'
    },
    template: '<div></div>',
		
    link: function(scope, element, attrs, $rootScope) {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      var player;

      $window.onYouTubeIframeAPIReady = function() {

        player = new YT.Player(element.children()[0], {
          playerVars: {
            autoplay: 1,
            showinfo: 1,
            controls: 1
          },
          
          height: 390,
          width: 640,
          videoId: scope.videoid, 

          events: {
          	'onReady': function(event){
          		 event.target.loadVideoById({'videoId': videos[current],
               'startSeconds': starts[current],
               'endSeconds': ends[current],
               'suggestedQuality': 'medium'});
                scope.someCtrlFn({arg:videos[current]});
          	},
            'onStateChange': function(event) {
              
              var message = {
                event: YT_event.STATUS_CHANGE,
                data: ""
              };
              
              switch(event.data) {
                case YT.PlayerState.PLAYING:
                  message.data = "PLAYING";
                  break;
                case YT.PlayerState.ENDED:
                  message.data = "ENDED";
                  break;
                case YT.PlayerState.UNSTARTED:
                  message.data = "NOT PLAYING";
                  break;
                case YT.PlayerState.PAUSED:
                	current = current + 1;
            		if (current >= videos.length) {
                	current = 0;
            		}
                	scope.playNext();
              //player.pauseVideo();
                  message.data = "PAUSED";
                  break;
              }

              scope.$apply(function() {
                scope.$emit(message.event, message.data);
              });
            }
          } 
        });
      };
		scope.currentlyPlaying = function(){
            console.info('Current Track id',videos[current]);
            scope.someCtrlFn({arg:videos[current]});
            return videos[current];
      };
      scope.playNext = function () {
            scope.increaseTrack();
            if (player) {
                scope.currentlyPlaying();
                player.loadVideoById({'videoId': videos[current],
               'startSeconds': starts[current],
               'endSeconds': ends[current],
               'suggestedQuality': 'medium'});
            } else {
                alert('Please Wait! Player is loading');
            }
            scope.someCtrlFn({arg:videos[current]});
      };
      scope.increaseTrack = function () {
            //YouTubePlayer.current = YouTubePlayer.current + 1;
            if (current >= videos.length) {
                current = 0;
            }
      };

    }  
  };
});
youApp.controller('youControl', ['videoData','$scope',function(videoData,$scope,YT_event) {
              $scope.yt = {
                firstName: "Youtube",
           		 lastName: "Application",
				    videoid: "V7HPQ6DVvug",
				    playerStatus: "NOT PLAYING",
				  };
				  $scope.YT_event = YT_event;
              $scope.title1 = function(test){
              		videoData.getTitle(test).then(function(response){ 
              		//$(".title_cls").text();
            		$scope.yt.title = response; //Assign data received to $scope.yt.title
        				});
              }//Assign data received to $scope.yt.title
}]);
youApp.factory('videoData',['$http',function($http){
 		  
        return {
            getTitle : function(id){
            var url = "https://www.googleapis.com/youtube/v3/videos?id="+id+"&key=AIzaSyC7tpBAV2Smd2Yp651o9YX5eXnmmpgq08k&part=snippet,statistics";
                return  $http.get(url).then(function(response){ //wrap it inside another promise using then
                            return response.data.items[0].snippet.title;  //only return title
                        });
            }
        }
    }])