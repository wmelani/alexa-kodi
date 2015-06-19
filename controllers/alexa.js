"use strict";
var Promise = require('mpromise');
var app = require('../app');
var kodiService = require(app.dir + '/api/kodi-service.js').create({ host : process.env.KODI_HOST});

function alexaPostRequest(req,response,done){
    response.send("not implemented");
}




module.exports = exports;
exports.alexaPostRequest = alexaPostRequest;