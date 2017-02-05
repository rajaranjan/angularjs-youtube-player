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