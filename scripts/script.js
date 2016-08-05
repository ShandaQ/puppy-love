var app = angular.module('app', ['ngRoute', 'ngCookies']);

var API = 'https://puppylovebackend-pnsqkugyke.now.sh';


app.config(function($routeProvider){
  $routeProvider

  .when('/', {
    controller: 'MainController',
    templateUrl: 'login.html'
  })

  .when('/register', {
    controller:  'registerController',
    templateUrl: 'register.html'
  })

  .when('/profile/:id', {
    controller:  'profileController',
    templateUrl: 'profile.html'
  })

  .when('/pupfile/:id', {
    controller:  'pupfileController',
    templateUrl: 'pupfile.html'
  })

  .when('/loveConnection', {
    controller:  'loveConnectionController',
    templateUrl: 'loveConnection.html'
  })

  .when('/search',{
    controller: 'searchController',
    templateUrl: 'search.html'
  });
});


app.controller('MainController', function($scope, $http, $location, $cookies){

  $scope.register = function(){
    $location.path('/register');
  };

  $scope.login = function(){
    var credentials = {
      username: "",
      password: ""
    };

    credentials.username = $scope.username;
    credentials.password = $scope.password;

    $http.post(API+"/login", credentials)
      .success(function(data){
        $cookies.put('username',credentials.username);
        $location.path('/search');
      })
      .error(function(err){
        $scope.errorMessage = err.message;
      });
  };
});



app.controller('profileController', function($scope, $routeParams, $http, $location, $cookies){
  $scope.refresh = function(){
    $http.get(API+'/profile/'+$routeParams.id)
      .success(function(data){
        console.log(data);
        $scope.data = data.results;

        console.log(data.results[0].username);
        console.log($cookies.get('username'));
        $scope.hideAddPetBtn = data.results[0].username !== $cookies.get('username');
        console.log($scope.hideAddPetBtn);
      });
  };

  $scope.refresh();

    $scope.add =function(){
      var credentials = {
        petname: "",
        petage: "",
        petbreed: "",
        petlitters: "",
        petgender: "",
        username: $cookies.get('username')
      };

      credentials.petname = $scope.petname;
      credentials.petage = $scope.petage;
      credentials.petbreed = $scope.petbreed;
      credentials.petlitters = $scope.petlitters;
      credentials.petgender = $scope.petgender;

      $http.post(API+'/addpet', credentials)
        .success(function(data){
          $scope.refresh();
        });
    };

});

app.controller('pupfileController', function($scope, $routeParams,$http,$location){
  // $routeParams.id;

  $http.get(API+'/petfile/'+$routeParams.id)
    .success(function(data){
      $scope.data = data.results;
    });
});

app.controller('searchController', function($scope, $http, $location){
  $http.get(API+'/listpuppies')
    .success(function(data){
      $scope.pups = data.data;
      console.log('search data',data);
    });
});

app.controller('registerController', function($scope, $http, $routeParams, $location){
  $scope.login = function(){
    var credentials = {
      username: "",
      email: "",
      password: "",
      location: ""
    };

    credentials.username = $scope.username;
    credentials.email = $scope.email;
    credentials.password = $scope.password;
    credentials.location = $scope.location;

    $http.post(API+"/register", credentials)
      .success(function(data){

        $location.path('/search');
        // $location.path('/profile/'+$routeParams.id);
      })
      .error(function(err){
        $scope.errorMessage = err.message;
      });
  };
});

app.controller('loveConnection', function($scope, $location){
  // $scope.gotToSumbit = function(){
  //   var review = alert("thank you for your review");
  //   $location.path('/');
  // };
});
