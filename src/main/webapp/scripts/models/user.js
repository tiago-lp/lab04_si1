'use strict';

function User(data) {
	data = data || {};
	_.extend(this, data);
}

User.prototype.addToWatchList = function addToWatchList(serie) {
    this.watchList.push(serie);
};

User.prototype.removeFromWatchList = function removeFromWatchList(serie) {
    _.remove(this.watchList, foundSerie => foundSerie === serie);
};

User.prototype.addToPerfil = function addToPerfil(serie) {
    this.mySeries.push(serie);
};

User.prototype.removeFromPerfil = function removeFromPerfil(serie) {
    _.remove(this.mySeries, foundSerie => foundSerie === serie);
};

User.prototype.includesInPerfilOrWatchList = function includesInPerfilOrWatchList(serie) {
    return (_.includes(this.mySeries, serie.imdbID) 
        || _.includes(this.watchLis, serie.imdbID));
};

