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
    else if (intent === "PLAYRANDOM"){
        console.log(req.body.request.intent.slots.Show.value);
        kodiService.searchTVShows({label : req.body.request.intent.slots.Show.value})
            .then(function(x){
                kodiService.getTVShowEpisodes(x.tvshowid)
                    .then(function(y){
                        var randIdx = _.random(0,y.result.episodes.length);
                        kodiService.playEpisode(y.result.episodes[randIdx].episodeid).then(function(z){
                            sendMessage(response,"Playing episode " + y.result.episodes[randIdx].label + " of " + x.label);
                        })
                    })
            })
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