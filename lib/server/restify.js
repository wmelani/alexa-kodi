"use strict";

var restify = require('restify');

function createRestify(app){
    var server = restify.createServer({
        name: 'sad-alexa',
        version: '1.0.0'
    });
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    server.listen((process.env.PORT || 5000), function () {
        console.log('%s listening at %s', server.name, server.url);
    });
    return server;

}


var __server;
function getServer(){
    return __server;
}

function run(app){

    app.server.restify = exports;
    __server = createRestify(app);
}

module.exports = exports = { run : run, getServer : getServer};