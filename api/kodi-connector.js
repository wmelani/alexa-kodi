var kodiService = require(__dirname + '/kodi-service.js');
var Promise = require('mpromise');
var app = require('../app.js');
var Filter = require(app.dir + '/utilities/array-filter.js');
var kodi;
var options;
function register(opts){
    options = opts;
    kodi = kodiService.create(options);
    return module.exports;
}
function connect(){
    var promise = new Promise;
    kodi.getActivePlayers()
        .then(function (x){
            getFirstPlayer(x);
            promise.resolve({
                "playerid" : activePlayerId
            });
        })
        .onReject(function(x){
            handleError(x);
            promise.reject(x);
        });
    return promise;
}
var activePlayerId = 1;
function getFirstPlayer(data){
    if (data !== undefined && data.result !== undefined && data.result.length > 0) {
        activePlayerId = data.result[0].playerid;
    }else{
        console.warn("Unable to find active player");
    }

}
function handleError(x){
    console.log(typeof x === "object" ? JSON.stringify(x) : x);
}
function getMovies(){
    return searchMovies();
}
function pause(){
    return kodi.pause(activePlayerId);
}
function play(){
    return kodi.play(activePlayerId);
}
function stop(){
    return kodi.stop(activePlayerId);
}
function getPlayerStatus(){
    return kodi.info(activePlayerId);
}
function getTVShows(){
    return kodi.getTVShows();
}
function searchTVShows(query){
    var promise = new Promise;
    kodi.getTVShows().then(function (data){
        if (query !== undefined){
            promise.fulfill(Filter.filter(data.tvshows,query));
        }else{
            promise.fulfill(data.tvshows);
        }

    }).onReject(function(x){
        handleError(x);
        promise.reject(x);
    });
    return promise;
}

function searchMovies(query){
    var promise = new Promise;
    kodi.getMovies().then(function (data){
        if (query !== undefined){
            promise.fulfill(Filter.filter(data.result.movies,query));
        }else{
            promise.fulfill(data.result.movies);
        }

    }).onReject(function(x){
        handleError(x);
        promise.reject(x);
    });
    return promise;
}
function getActivePlayers(){
    return kodi.getActivePlayers();
}
function getTVShowDetails(tvshowid){
    return kodi.getTVShowDetails(tvshowid);
}
function getTVShowEpisodes(tvshowid){
    return kodi.getTVShowEpisodes(tvshowid);
}
module.exports = exports;
exports.register = register;
exports.connect = connect;
exports.getMovies = getMovies;
exports.pause = pause;
exports.play = play;
exports.stop = stop;
exports.getPlayerStatus = getPlayerStatus;
exports.getMovies = getMovies;
exports.getTVShows = getTVShows;
exports.searchTVShows = searchTVShows;
exports.searchMovies = searchMovies;
exports.getActivePlayers = getActivePlayers;
exports.getTVShowDetails = getTVShowDetails;
exports.getTVShowEpisodes = getTVShowEpisodes;