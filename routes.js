"use strict";

exports.register = function (app, restify) {
    var c = app.controllers,
        server = restify.getServer();

    server.post('/', c.alexa.alexaPostRequest);
    server.get('/pause', c.kodi.pause);
    server.get('/play', c.kodi.play);
    server.get('/stop', c.kodi.stop);
    server.get('/info', c.kodi.info);
    server.get('/getMovies', c.kodi.getMovies);
    server.get('/getTVShows', c.kodi.getTVShows);
    server.get('/getTVShowDetails', c.kodi.getTVShowDetails);
    server.get('/getTVShowEpisodes', c.kodi.getTVShowEpisodes);
    server.get('/playEpisode', c.kodi.playEpisode);
};