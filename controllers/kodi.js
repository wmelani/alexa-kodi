"use strict";
var Promise = require('mpromise');
var app = require('../app.js');
var kodiService = require(app.dir + '/api/kodi-service.js').create({ host : process.env.KODI_HOST});

function pause(req,response,done){
    kodiService.pause().then(function(x){
        response.send(x.message);
    }).onReject(function(x){
        response.send(x.message);
    });
}

function play(req,response,done){
    kodiService.play().then(function(x){
        response.send(x.message);
    }).onReject(function(x){
        response.send(x.message);
    });
}
function stop(req,response,done){
    kodiService.stop().then(function(x){
        response.send(x.message);
    }).onReject(function(x){
        response.send(x.message);
    });
}
function info(req,response,done){
    kodiService.info().then(function(x){
        response.send(x.message);
    }).onReject(function(x){
        response.send(x.message);
    });
}
module.exports = exports;
exports.pause = pause;
exports.play = play;
exports.stop = stop;
exports.info = info;