'use strict';
(function() {
	var app = angular.module('app');

	app.controller('LoginController', function LoginController(AuthService, UserService, $state, $mdToast) {
		var loginCtrl = this;

		loginCtrl.loginForm = {};

		loginCtrl.login = function login() {
			UserService.login(loginCtrl.loginForm).then(function success() {
				loginCtrl.loginForm = {};
				AuthService.load().then(function(){
					window.location.replace("#/");

				});
			}, function error() {
				showToast('Email ou senha incorreto');
			});
		}

		loginCtrl.logout = function logout() {
			UserService.logout();
			loginCtrl.loginForm = {};
		}

		function showToast(msg) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(msg)
                    .action('FECHAR')
                    .highlightAction(true)
                    .hideDelay(5000)
                    .position('bottom right')
            );
        }
	});
})();
