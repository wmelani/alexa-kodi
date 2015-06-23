"use strict";
var app = require('../app.js');
var kodiService = require(app.dir + '/api/kodi-connector.js').register({ host : process.env.KODI_HOST});

function pause(req,response,done){
    kodiService.connect().then(pause).then(function(x){
        response.send(x.message);
    }).onReject(function(x){
        response.send(x.message);
    });
}

function play(req,response,done){
    kodiService.connect().then(play).then(function(x){
        response.send(x.message);
    }).onReject(function(x){
        response.send(x.message);
    });
}
function stop(req,response,done){
    kodiService.connect().then(stop).then(function(x){
        response.send(x.message);
    }).onReject(function(x){
        response.send(x.message);
    });
}
function info(req,response,done){
    kodiService.connect().then(info).then(function(x){
        response.send(x.message);
    }).onReject(function(x){
        response.send(x.message);
    });
}
function getMovies(req,response,done){
    var numQueryParams = Object.keys(req.params).length;
    if (numQueryParams > 0){
        kodiService.searchMovies(req.params)
            .then(function(x){
                response.send(x);
            }).onReject(function(x){
                response.send(x.message);
            });
    }else{
        kodiService.getMovies()
            .then(function(x){
            response.send(x);
            }).onReject(function(x){
                response.send(x.message);
            });
    }

}

function getTVShows(req,response,done){
    var numQueryParams = Object.keys(req.params).length;

    if (numQueryParams > 0){
        kodiService.searchTVShows(req.query)
            .then(function(x){
                response.send(x);
            }).onReject(function(x){
                response.send(x.message);
            });
    }
    else{
        kodiService.getTVShows()
        .then(function(x){
            response.send(x);
        }).onReject(function(x){
            response.send(x.message);
        });
    }

}
function getTVShowDetails(req,response,done){
    if (req.params.tvshowid === "undefined"){
        response.status(422).end();
    }
    kodiService.getTVShowDetails(parseInt(req.params.tvshowid))
        .then(function(x){
            response.send(x);
        })
        .onReject(function(x){
           response.send(x.message);
        });
}
function getTVShowEpisodes(req,response,done){
    if (req.params.tvshowid === "undefined"){
        response.status(422).end();
    }
    kodiService.getTVShowEpisodes(parseInt(req.params.tvshowid))
        .then(function(x){
            response.send(x);
        })
        .onReject(function(x){
            response.send(x.message);
        });
}
module.exports = exports;
exports.pause = pause;
exports.play = play;
exports.stop = stop;
exports.info = info;
exports.getMovies = getMovies;
exports.getTVShows = getTVShows;
exports.getTVShowDetails = getTVShowDetails;
exports.getTVShowEpisodes = getTVShowEpisodes;