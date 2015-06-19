var Promise = require('mpromise');
var Restify = require('restify');
var _ = require('lodash');

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
    return module.exports;
}
function pause(){
    var promise = new Promise;
    getActivePlayerId().then(getPlayerStatus).then(function (data){
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
    }).onReject(function(x){
        promise.reject({
            code : "Error",
            message : x
        });
    });
    return promise;
}
function play(){
    var promise = new Promise;
    getActivePlayerId().then(getPlayerStatus).then(function (data){
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
    }).onReject(function(x){
        promise.reject({
            code : "Error",
            message : x
        });
    });
    return promise;
}

function stop(){
    var promise = new Promise;
    getActivePlayerId().then(getPlayerStatus).then(function (data){
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
    }).onReject(function(x){
        promise.reject({
            code : "Error",
            message : x
        });
    });
    return promise;
}

function __info(playerId){
    var args = {"jsonrpc": "2.0","method": "Player.GetItem", "params" : { "playerid": playerId},"id": 1};
    return __doJsonRPCRequest(args);
}

function info(){
    var promise = new Promise;
    getActivePlayerId().then(getPlayerStatus).then(function (data){
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
    }).onReject(function(x){
        promise.reject({
            code : "Error",
            message : x
        });
    });
    return promise;
}

function togglePlayPause(playerId){
    var args = {"jsonrpc": "2.0", "method": "Player.PlayPause", "params": { "playerid": playerId }, "id": 1};
    return __doJsonRPCRequest(args);

}
function __stop(playerId){
    var args = {"jsonrpc": "2.0","method": "Player.Stop","params": { "playerid": playerId },"id": 1};
    return __doJsonRPCRequest(args);
}


function getPlayerStatus(playerId){
    var promise = new Promise;
    var args = {"jsonrpc": "2.0","method": "Player.GetProperties", "params" : { "properties" : ["speed"], "playerid": playerId},"id": 1};
    __doJsonRPCRequest(args).then(function(data){
        promise.fulfill({
            playerid : playerId,
            isPlaying : data != null  && data.result != null && data.result.speed === 1
        });
    }).onReject(function(x){ promise.reject(x);});
    return promise;
}
function getActivePlayerId() {
    var promise = new Promise;
    var args = {"jsonrpc": "2.0","method": "Player.GetActivePlayers", "id": 1};
    __doJsonRPCRequest(args).then(function(data){
        if (data.result !== undefined && data.result.length > 0){
            promise.fulfill(data.result[0].playerid);
        }else{
            promise.reject("Nothing is playing");
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

module.exports = exports;
exports.create = create;
exports.pause = pause;
exports.play = play;
exports.stop = stop;
exports.info = info;