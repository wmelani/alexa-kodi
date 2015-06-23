var Promise = require('mpromise');
var Restify = require('restify');
var _ = require('lodash');
var requestGenerator = require(__dirname + '/kodi-request-generator.js');
var DEFAULT_OPTS = {
    host : "http://localhost:8080"
};
var options;
var client = {};

function create(opt){
    options = _.extend(DEFAULT_OPTS,opt);
    client = Restify.createJsonClient({
        url: options.host,
        version: '*'
    });
    return this;
}
function getMovies(){
    return searchMovies();
}
function searchMovies(){
    return __doJsonRPCRequest(requestGenerator.getMovies());
}
function __handleRejection(x){
    return {
        code : "Error",
        message : x
    };
}
function getTVShows(){
    var promise = new Promise;
    __doJsonRPCRequest(requestGenerator.getTVShows()).then(function (data){
        promise.fulfill(data.result);
    }).onReject(__handleRejection);
    return promise;
}

function pause(activePlayerId){
    var promise = new Promise;
    getPlayerStatus(activePlayerId).then(function (data){
        if (data.playerid !== undefined && data.isPlaying){
            togglePlayPause(data.playerid).then(function(){
                promise.fulfill({
                    status: "Paused",
                    message: "Player Paused"
                });
            });
        }else{
            promise.fulfill({
                status: "Paused",
                message: "Player Paused"
            });
        }
    }).onReject(__handleRejection);
    return promise;
}
function play(activePlayerId){
    var promise = new Promise;
    getPlayerStatus(activePlayerId).then(function (data){
        if (data.playerid !== undefined && data.isPlaying == true){
            promise.fulfill({
                status: "Playing",
                message: "Already Playing"
            });
        }else{
            togglePlayPause(data.playerid).then(function(){
                promise.fulfill({
                    status: "Playing",
                    message: "Player Resumed"
                });
            });
        }
    }).onReject(__handleRejection);
    return promise;
}

function stop(activePlayerId){
    var promise = new Promise;
    getPlayerStatus(activePlayerId).then(function (data){
        if (data.playerid !== undefined && data.isPlaying){
            __stop(data.playerid).then(function(){
                promise.fulfill({
                    status: "Stopped",
                    message: "Player Stopped"
                });
            });
        }else{
            promise.fulfill({
                status: "Stopped",
                message: "Not Playing"
            });
        }
    }).onReject(__handleRejection);
    return promise;
}

function __info(playerId){
    return __doJsonRPCRequest(requestGenerator.getInfo(playerId));
}

function info(activePlayerId){
    var promise = new Promise;
    getPlayerStatus(activePlayerId).then(function (data){
        if (data.playerid !== undefined && data.isPlaying == true){
            __info(data.playerid).then(function(info){
                if (info.result != null && info.result.item != null && info.result.item.label != null){
                    promise.fulfill({
                        status: "Playing",
                        message: "Playing " + info.result.item.label,
                        currentlyPlaying : info.result.item.label
                    });
                }else{
                    promise.fulfill({
                        status: "Stopped",
                        message: "Nothing Is Playing",
                        currentlyPlaying : "Nothing Is Playing"
                    });
                }

            });
        }else{
            promise.fulfill({
                status: "Stopped",
                message: "Nothing Is Playing",
                currentlyPlaying : "Nothing Is Playing"
            });
        }
    }).onReject(__handleRejection);
    return promise;
}

function togglePlayPause(playerId){

    return __doJsonRPCRequest(requestGenerator.togglePlayPause(playerId));

}
function __stop(playerId){
    return __doJsonRPCRequest(requestGenerator.stop(playerId));
}


function getPlayerStatus(playerId){
    var promise = new Promise;

    __doJsonRPCRequest(requestGenerator.getPlayerStatus(playerId)).then(function(data){
        promise.fulfill({
            playerid : playerId,
            isPlaying : data != null  && data.result != null && data.result.speed === 1
        });
    }).onReject(function(x){ promise.reject(x);});
    return promise;
}
function getActivePlayers() {
    var promise = new Promise;
    __doJsonRPCRequest(requestGenerator.getActivePlayers()).then(function(data){
        if (data.result !== undefined) {
            if (data.result.length > 0) {
                promise.fulfill(data.result[0].playerid);
            } else {
                promise.fulfill("No player active");
            }
        }else{
            promise.reject("Invalid data: " + data);
        }

    });
    return promise;
}
function __doJsonRPCRequest(args){
    var promise = new Promise;

    client.post('/jsonrpc',args,function(err,req,res,obj){
        promise.fulfill(obj);
    });
    return promise;
}
function getTVShowDetails(tvshowid){
    var promise = new Promise;

    __doJsonRPCRequest(requestGenerator.getTVShowDetails(tvshowid)).then(function(data){
        promise.fulfill(data);
    }).onReject(function(x){ promise.reject(x);});
    return promise;
}
function getTVShowEpisodes(tvshowid){
    var promise = new Promise;

    __doJsonRPCRequest(requestGenerator.getTVShowEpisodes(tvshowid)).then(function(data){
        promise.fulfill(data);
    }).onReject(function(x){ promise.reject(x);});
    return promise;
}
function playEpisode(episodeId){
    var promise = new Promise;

    __doJsonRPCRequest(requestGenerator.playEpisode(episodeId)).then(function(data){
        promise.fulfill(data);
    }).onReject(function(x){ promise.reject(x);});
    return promise;
}
module.exports = exports;
exports.create = create;
exports.pause = pause;
exports.play = play;
exports.stop = stop;
exports.info = info;
exports.getMovies = getMovies;
exports.getTVShows = getTVShows;
exports.searchMovies = searchMovies;
exports.getActivePlayers = getActivePlayers;
exports.getTVShowDetails = getTVShowDetails;
exports.getTVShowEpisodes = getTVShowEpisodes;
exports.playEpisode = playEpisode;