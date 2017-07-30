'use strict';
(function() {
	var app = angular.module('app');

	app.controller('SigninController', function SigninController(UserService, $state, $mdToast) {
		var signinCtrl = this;

		signinCtrl.registerForm = {};

		signinCtrl.register = function register() {
			UserService.register(signinCtrl.registerForm).then(function success() {
				signinCtrl.registerForm = {};
				$state.go('login');
			}, function error() {
				showToast('Email já cadastrado no sistema');
			});
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
