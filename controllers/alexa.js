"use strict";
var Promise = require('mpromise');
var app = require('../app');
var kodiService = require(app.dir + '/api/kodi-service.js').create({ host : process.env.KODI_HOST});

function alexaPostRequest(req,response,done){
    console.log(req.body);
    var text= "test";
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