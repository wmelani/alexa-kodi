"use strict";
var Promise = require('mpromise');
var _ = require('lodash');
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
    else if (intent === "PLAYRANDOM"){
        console.log("------" + JSON.stringify(req.body) + "-----");
        console.log(JSON.stringify(req.body.request.intent.slots.Show.value));
        kodiService.searchTVShows({label : req.body.request.intent.slots.Show.value})
            .then(function(x){
                kodiService.getTVShowEpisodes(x[0].tvshowid)
                    .then(function(y){
                        var randIdx = _.random(0,y.result.episodes.length);
                        kodiService.playEpisode(y.result.episodes[randIdx].episodeid).then(function(z){
                            sendMessage(response,"Playing episode " + y.result.episodes[randIdx].label + " of " + x.label);
                        }).onReject(function(xx){
                            console.log(xx);
                            sendMessage(response,"So sorry");
                        });
                    }).onReject(function(xxx){
                        console.log(xxx);
                        sendMessage(response,"So sorry");
                    });
            }).onReject(function(x){
                console.log(x);
                sendMessage(response,"So sorry");
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