// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'angular-md5'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('tabs',{
      url: '/tab',
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    .state('tabs.list',{
      url: '/list',
      views: {
        'list-tab':{
          templateUrl: 'templates/list.html',
          controller: 'ControllerList',
        }
      }
    })

    .state('tabs.details',{
      url:'/list/:comicId',
      views:{
        'list-tab': {
          templateUrl: 'templates/details.html',
          controller: 'ControllerDetails'
        }
      }    
    })

    $urlRouterProvider.otherwise('/tab/list');
})
.factory('MarvelFactory',['$http', 'md5', function($http, md5){
  var baseUrl = 'http://gateway.marvel.com/v1/'
  var comicsUrl = "public/comics"
  var publicKey = "610a27f6742ec655e90c26f978e878f5"
  var privateKey = "e3238a6515e0b4656c260f7d8ed0fccce7f192f7"
  var timeStamp = Date.now()
  var hash = md5.createHash(timeStamp+privateKey+publicKey)   
  return {
    getAllComics: function() {
      return $http.get(baseUrl + comicsUrl, {
        params: { ts: timeStamp, apikey: publicKey, hash: hash }
      }) 
    },
    getComic: function(comicId) {
      return $http.get(baseUrl + comicsUrl + '/' + comicId, {
        params: { ts: timeStamp, apikey: publicKey, hash: hash }
      })
    }
  }

}])
.controller('ControllerDetails', ['$scope', '$http', '$state', 'MarvelFactory',function($scope, $http, $state, MarvelFactory) {

 
  var id = $state.params.comicId
  $scope.comic = {}
  $scope.getComic = function() {
    MarvelFactory.getComic(id)
    .success(function(data){
      comic = data.data.results[0]
      $scope.comic = {
        image: comic.thumbnail.path + '.' + comic.thumbnail.extension,
        title: comic.title,
        authors: comic.creators.items,
        description: comic.description
      }
    })
  }
  $scope.getComic()

}])
.controller('ControllerList', ['$scope', '$http', '$state', 'MarvelFactory',function($scope, $http, $state, MarvelFactory){
  
  $scope.comics = []
  $scope.getAllComics = function() {
    MarvelFactory.getAllComics()  
    .success(function(data){
      angular.forEach(data.data.results, function(comic) {
        comicObj = {
          title: comic.title,
          description: comic.description,
          id: comic.id,
          image: comic.thumbnail.path + "." +comic.thumbnail.extension,
        }
        this.push(comicObj)
      },$scope.comics)
    })
  }

  $scope.getAllComics()
}]);