'use strict';
(function() {
    var app = angular.module('app');

    app.controller("MainController", function MainController($mdSidenav, $mdDialog, $mdToast, $state, AuthService,
     $rootScope, UserService, SerieService) {
        var mainCtrl = this;

        mainCtrl.searchList = [];
        mainCtrl.watchList = [];
        mainCtrl.mySeries = [];
        mainCtrl.keyWord = '';
        mainCtrl.currentKeyWord = '';
        mainCtrl.currentSerie = {};
        mainCtrl.myRating = '';
        mainCtrl.lastEp = '';
        mainCtrl.newUser = {};

        Object.defineProperty(mainCtrl, 'user', {
            get: function() {
                return AuthService.user;
            },
            set: function(newValue) {
                AuthService.user = newValue;
            }
        });

        mainCtrl.search = function search() {
            if(mainCtrl.currentKeyWord.length > 0) {
                SerieService.getSeries(mainCtrl.currentKeyWord).then(function success(response) {
                    mainCtrl.searchList = response.data.Search == undefined ? [] : response.data.Search;
                    mainCtrl.keyWord = mainCtrl.currentKeyWord;
                    clearSearch();
                    $state.go('app.search');
                }, function error(response) {
                    mainCtrl.searchList = [];
                });
            }
        };

        function clearSearch() {
            mainCtrl.currentKeyWord = '';
        };

        mainCtrl.isValidSearch = function isValidSearch() {
            return mainCtrl.searchList.length != 0;
        };

        mainCtrl.getSinopse = function getSinopse(ev, serie) {
            SerieService.getInfoSerie(serie.imdbID).then(function success(response) {
                showAlert(ev, response.data.Title,
                    response.data.Plot == "N/A" ? "Sem Sinopse": response.data.Plot);
            }, function error(response) {
                alert(response.data.msg);
            });
        };

        mainCtrl.addToPerfil = function addToPerfil(ev, serie) {
            if(!(_.includes(mainCtrl.user.mySeries, serie.imdbID))) {
                SerieService.getInfoSerie(serie.imdbID).then(function success(response) {
                    mainCtrl.user.addToPerfil(". " + ". " + response.data.imdbID);
                    removeSerie(mainCtrl.user.watchList, response.data.imdbID);
                    UserService.save(mainCtrl.user).then(function(response) {
                        showAlert(ev, 'Sucesso', 'Série adicionada ao seu Perfil');
                        mainCtrl.getWatchList();
                    });
                }, function error(response) {
                    alert(response.data.msg);
                })
            } else {
                showAlert(ev, 'Erro', 'Esta série já está no seu perfil');
            }
         };

        mainCtrl.removeFromPerfil = function removeFromPerfil(ev, serie) {
            showConfirm(ev, serie.myRating + " " + serie.lastEp + " " + serie.imdbID);
         };

        mainCtrl.addToWatchList = function addToWatchList(ev, serie) {
            if(!(mainCtrl.user.includesInPerfilOrWatchList(serie))) {
                mainCtrl.user.addToWatchList(serie.imdbID);
                UserService.save(mainCtrl.user).then(function() {
                    showAlert(ev, 'Sucesso', 'Série adicionada a sua WatchList')
                });
            } else if(_.includes(mainCtrl.user.mySeries, serie.imdbID)) {
                showAlert(ev, 'Erro', 'Você não pode adicionar a sua WatchList pois você já acompanha esta série');
            } else {
                showAlert(ev, 'Erro', 'Esta série já está na sua WatchList');
            }
         };

        mainCtrl.removeFromWatchList = function removeFromWatchList(ev, serie) {
            mainCtrl.user.removeFromWatchList(serie.imdbID);
            UserService.save(mainCtrl.user).then(function() {
                showAlert(ev, 'Sucesso', 'Série removida da sua WatchList');
                mainCtrl.getWatchList();
            });
         };

        mainCtrl.getMySeries = function() {
            if(mainCtrl.user){
              var mySeries = []
              for (var i = 0; i < mainCtrl.user.mySeries.length; i++) {
                 var serie = mainCtrl.user.mySeries[i].split(' ');
                 var imdbID = serie[serie.length - 1];
                 SerieService.getInfoSerie(imdbID).then(function success(response) {
                     mySeries.push(response.data);
                 });
              }
              mainCtrl.mySeries = mySeries; 
          }
        };

        function updateInfos() {
            if(mainCtrl.user) {
              for (var i = 0; i < mainCtrl.user.mySeries.length; i++) {
                  var serie = mainCtrl.user.mySeries[i].split(' ');
                  var myRating = serie[0];
                  var lastEp = serie[1];
                  mainCtrl.mySeries[i].myRating = myRating;
                  mainCtrl.mySeries[i].lastEp = lastEp;
              }
            }
        }

        mainCtrl.getWatchList = function() {
           if(mainCtrl.user) {
               var watchList = [];
               for (var i = 0; i < mainCtrl.user.watchList.length; i++) {
                   SerieService.getInfoSerie(mainCtrl.user.watchList[i]).then(function success(response) {
                       watchList.push(response.data);
                   });
               }
               mainCtrl.watchList = watchList;
           }
        };
        mainCtrl.addRating = function addRating(serie) {
            var foundSerie = find(serie);
            foundSerie = foundSerie.split(' ');
            foundSerie[0] = mainCtrl.myRating;
            foundSerie = foundSerie.join(' ');
            serie.myRating = mainCtrl.myRating;
            updateSerie(foundSerie);
            UserService.save(mainCtrl.user).then(function() {
                mainCtrl.myRating = '';
            });
        };

        mainCtrl.addLastEp = function addLastEp(serie) {
            var foundSerie = find(serie);
            foundSerie = foundSerie.split(' ');
            foundSerie[1] = mainCtrl.lastEp;
            foundSerie = foundSerie.join(' ');
            serie.lastEp = mainCtrl.lastEp;
            updateSerie(foundSerie);
            UserService.save(mainCtrl.user).then(function() {
                mainCtrl.lastEp = '';
            });
        };

        function removeSerie(serieList, serie) {
            _.remove(serieList, foundSerie => foundSerie === serie);
        };

        function find(serie) {
            for (var i = 0; i < mainCtrl.user.mySeries.length; i++) {
                var foundSerie = mainCtrl.user.mySeries[i].split(' ');
                var imdbID = foundSerie[foundSerie.length - 1];
                if(imdbID == serie.imdbID) {
                    return mainCtrl.user.mySeries[i];
                }
            }
        }

        function findInController(serie) {
            for (var i = 0; i < mainCtrl.mySeries.length; i++) {
                if(mainCtrl.mySeries[i].imdbID == serie.imdbID) {
                    return mainCtrl.mySeries[i];
                }
            }
        }

        function updateSerie(serie) {
            var serieImdbID = serie.split(' ');
            serieImdbID = serieImdbID[serieImdbID.length - 1];
            for (var i = 0; i < mainCtrl.user.mySeries.length; i++) {
                var foundSerie = mainCtrl.user.mySeries[i].split(' ');
                var imdbID = foundSerie[foundSerie.length - 1];
                if(imdbID == serieImdbID) {
                    mainCtrl.user.mySeries[i] = serie;
                }
            }
        }

        function showAlert(ev, title, content) {
             $mdDialog.show(
               $mdDialog.alert()
                 .parent(angular.element(document.querySelector('#popupContainer')))
                 .clickOutsideToClose(true)
                 .title(title)
                 .textContent(content)
                 .ariaLabel('Sinopse')
                 .ok('Ok')
                 .targetEvent(ev)
             );
           };

        function showConfirm(ev, serie) {
            var confirm = $mdDialog.confirm()
                  .title('Aviso')
                  .textContent('Deseja realmente remover esta série do seu perfil?')
                  .ariaLabel('Confirm dialog')
                  .targetEvent(ev)
                  .ok('Remover')
                  .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                mainCtrl.user.removeFromPerfil(serie);
                UserService.save(mainCtrl.user).then(function() {
                    showAlert(ev, 'Sucesso', 'Série removida do seu perfil');
                    mainCtrl.getMySeries();
                });
            });
          };

        mainCtrl.getInfoSerie = function getInfoSerie(ev, serie) {
            if(SerieService.serie != {}) {
                var foundSerie = findInController(SerieService.serie);
                foundSerie = SerieService.serie;
            }
            SerieService.serie = serie;
            updateInfos();
            $mdDialog.show({
              templateUrl: '../../views/about.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              fullscreen: false
            });
          };

        mainCtrl.hide = function() {
              $mdDialog.hide().then(function() {
                mainCtrl.go('app.home');
              });
        };

        mainCtrl.cancel = function() {
            SerieService.serie = mainCtrl.currentSerie;
              $mdDialog.cancel().then(function() {
                mainCtrl.go('app.home');
              });
        };

        var loadSerie = function() {
            mainCtrl.currentSerie = SerieService.serie;
        };

        loadSerie();

        mainCtrl.logout = function logout() {
            UserService.logout().then(function success() {
                AuthService.load().then(function(){
                    $state.go('landing_page');
                });
            });
        };

        mainCtrl.go = function go(state) {
            if(state == 'app.home') {
                mainCtrl.getMySeries();
            } else if(state == 'app.watchlist') {
                mainCtrl.getWatchList();
            }
            $state.go(state);
        };

        mainCtrl.isLogged = function isLogged() {
            if(mainCtrl.user){
                return mainCtrl.user.logged;
            }
        };

        $rootScope.$on("user_loaded", function() {
            if (!mainCtrl.user.logged) {
                $state.go("login");
            }
        });

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