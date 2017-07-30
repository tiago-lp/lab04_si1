'use strict';

(function() {
	var app = angular.module('app');

	app.service('SerieService', function SerieService($http, $q) {

		var service = this;

		service.serie = {};

		service.getSeries = function getSeries(name) {
		    var deferred = $q.defer();
		    $http.get('http://www.omdbapi.com/?s=' + name + '&type=series&apikey=93330d3c')
		    	.then(function success(response) {
		                deferred.resolve(response);
		            }, function error(response) {
		                deferred.reject(response);
		            });
		    return deferred.promise;
		};

		service.getInfoSerie = function getInfoSerie(imdbID) {
			var deferred = $q.defer();
			$http.get('http://www.omdbapi.com/?i=' + imdbID + '&plot=full&apikey=93330d3c')
				.then(function success(response) {
					deferred.resolve(response);
				}, function error(response) {
					deferred.reject(response);
				});
			return deferred.promise;
		}
	});
})();