"use strict";
var _ = require('lodash');
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
function playEpisode(req,response,done){
    kodiService.searchTVShows({label : req.params.label})
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
module.exports = exports;
exports.pause = pause;
exports.play = play;
exports.stop = stop;
exports.info = info;
exports.getMovies = getMovies;
exports.getTVShows = getTVShows;
exports.getTVShowDetails = getTVShowDetails;
exports.getTVShowEpisodes = getTVShowEpisodes;
exports.playEpisode = playEpisode;