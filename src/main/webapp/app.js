'use strict';

(function() {
  var app = angular.module('app', [
    'ngMaterial',
    'ui.router'
    ]);
  
    app.config(function ($mdIconProvider, $stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {
      $locationProvider.hashPrefix('');
      $mdIconProvider.fontSet('md', 'material-icons');
      $stateProvider
      .state("app", {
          abstract: true,
          views: {
              main: {
                  templateUrl: "views/main.html",
                  controller: "MainController as mainCtrl"
              }
          }
      })
      .state("landing_page", {
        url: "/",
        views: {
          main: {
            templateUrl: "views/landing_page.html"
          }
        }
      })
      .state("app.init", {
        url: "/init",
        views: {
          content: {
            templateUrl: 'views/init.html',
          }
        }
      })
      .state("app.home", {
          url: "/home",
          views: {
              content: {
                  templateUrl: "views/home.html",
              }
          }
      })
      .state('app.watchlist', {
          url: '/watchlist',
          views:{
              content: {
                  templateUrl: 'views/watchlist.html',
              }
          }
      })
      .state('app.search', {
          url: '/search',
          views: {
              content: {
                  templateUrl: 'views/search.html',
              }
          }
      })
      .state('login', {
        url: '/login',
        views: {
            main: {
              templateUrl: 'views/login.html',
              controller: 'LoginController as loginCtrl'
            }
        }
      })
      .state('signin', {
        url: '/signin',
        views: {
          main: {
            templateUrl: 'views/signin.html',
            controller: 'SigninController as signinCtrl'
          }
        }
      });
      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(false);
    });

   app.service('AuthInterceptor', function AuthInterceptor($q, $state) {
           var service = this;

           service.responseError = function() {
               if (AuthService.user.logged == false) {
                   $state.go("landing_page");
               } 
               return $q.reject(response);
           };
       });
})();