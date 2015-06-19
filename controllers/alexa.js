"use strict";
var Promise = require('mpromise');
var app = require('../app');
var kodiService = require(app.dir + '/api/kodi-service.js').create({ host : process.env.KODI_HOST});

function alexaPostRequest(req,response,done){
    console.log(req.body);
    var intent = req.body.request.intent.name;

    if (intent == "PLAY"){
        kodiService.play().then(function(x){
            sendMessage(response, x.message);
        });
    }
    else if (intent == "PAUSE"){
        kodiService.pause().then(function(x){
            sendMessage(response, x.message);
        });
    }
    else if (intent == "STOP"){
        kodiService.stop().then(function(x){
            sendMessage(response, x.message);
        });
    }
    else if (intent == "PLAYING"){
        kodiService.info().then(function(x){
            sendMessage(response, x.currentlyPlaying);
        });
    }
    else{
        sendMessage(response, "So sorry");
    }
}

function sendMessage(response,text){
    var obj = {
        "version": "1.0",
        "sessionAttributes": {
        },
        "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": text
            },
            "card": {
                "type": "Simple",
                "title": "Kodi",
                "content": text
            },
            "shouldEndSession": true
        }
    };
    response.send(obj);
}




module.exports = exports;
exports.alexaPostRequest = alexaPostRequest;