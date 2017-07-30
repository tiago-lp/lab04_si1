'use strict';

(function() {
    var app = angular.module("app");

    app.service("UserService", function UserService($http, $q) {
        var service = this;

        service.login = function login(userForm) {
            var deffered = $q.defer();
            $http.post('/user/login', userForm).then(function success(response) {
                deffered.resolve(response);
            }, function error(response) {
                deffered.reject(response);
                console.log('Erro ao fazer login');
            });
            return deffered.promise;
        };

        service.logout = function logout(userForm) {
            var deffered = $q.defer();
            $http.post('/user/logout').then(function success(response) {
                deffered.resolve(response);
            }, function error(response) {
                deffered.reject(response);
                console.log('Erro ao fazer logout');
            });
            return deffered.promise;
        };

        service.register = function register(userForm) {
            var deffered = $q.defer();
            $http.post('/user/signin', userForm).then(function success(response) {
                deffered.resolve(response);
            }, function error(response) {
                deffered.reject(response);
                console.log('Erro ao fazer cadastro');
            });
            return deffered.promise;
        };

        service.save = function save(user) {
            var deffered = $q.defer();
            $http.put('/user/update', user).then(function success(info) {
                deffered.resolve(info.data);
            }, function error(data) {
                deffered.reject(data);
            });
            return deffered.promise;
        };
    });
})();