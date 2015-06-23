"use strict";
var _ = require('lodash');

var DEFAULT_PLAYER_PROPERTIES = ["speed", "percentage", "time", "totaltime", "canseek", "position"];
var DEFAULT_MOVIE_PROPERTIES = ["title", "plot", "votes", "rating"];
var DEFAULT_EPISODE_PROPERTIES = ["plot", "season", "episode"];
var DEFAULT_TV_SHOW_PROPERTIES = ["season","episode"];
function getMovies(props){
    return __getRPC("VideoLibrary.GetMovies", props, DEFAULT_MOVIE_PROPERTIES);
}
function getInfo(playerId){
    return __getRPC("Player.GetItem",{ playerid : playerId});
}
function togglePlayPause(playerId){
    return __getRPC("Player.PlayPause",{ playerid : playerId});
}
function stop(playerId){
    return __getRPC("Player.Stop",{ playerid : playerId});
}
function getPlayerStatus(playerId,properties){
    return __getRPCWithProperties("Player.GetProperties", properties,DEFAULT_PLAYER_PROPERTIES, {playerid : playerId});
}
function getActivePlayers(){
    return __getRPC("Player.GetActivePlayers");
}
function getRecentMovies(){
    return __getRPCWithProperties("VideoLibrary.GetRecentlyAddedMovies",DEFAULT_MOVIE_PROPERTIES, DEFAULT_MOVIE_PROPERTIES);
}
function getMovieDetails(movieId){
    return __getRPCWithProperties("VideoLibrary.GetMovieDetails", DEFAULT_MOVIE_PROPERTIES, DEFAULT_MOVIE_PROPERTIES, {movieid : movieId});
}
function playMovie(movieId){
    return __getRPCWithProperties("Player.Open",DEFAULT_MOVIE_PROPERTIES, DEFAULT_MOVIE_PROPERTIES,{item : { movieid : movieId}});
}
function getTVShows(props){
    return __getRPC("VideoLibrary.GetTVShows",props,DEFAULT_TV_SHOW_PROPERTIES);
}
function getTVShowDetails(tvshowid){
    return __getRPCWithProperties("VideoLibrary.GetTVShowDetails", DEFAULT_TV_SHOW_PROPERTIES, DEFAULT_TV_SHOW_PROPERTIES,{tvshowid : tvshowid});
}
function getTVShowEpisodes(tvshowid,props){
    return __getRPCWithProperties("VideoLibrary.GetEpisodes", props, DEFAULT_EPISODE_PROPERTIES, {tvshowid : tvshowid});
}
function getEpisodeDetails(episodeid,props){
    return __getRPCWithProperties("VideoLibrary.GetEpisodeDetails", props,DEFAULT_EPISODE_PROPERTIES, {episodeid : episodeid});
}
function getRecentlyAddedEpisodes(props){
   return __getRPCWithProperties("VideoLibrary.GetRecentlyAddedEpisodes", props, DEFAULT_EPISODE_PROPERTIES);
}
function playEpisode(episodeid){
     return __getRPC("Player.Open",{item : {episodeid : episodeid}})
}
function seek(playerid, moment){
    return __getRPC( "Player.Seek", {playerid : playerid, value : __getMomentValue(moment)});
}
function __getMomentValue(moment){

}
function __getRPCWithProperties(actionName,properties,defaultProperties,additionalProps){
    var props = defaultProperties;
    if (_.isArray(properties)){
        props = properties;
    }
    else if (typeof properties === "string"){
        props = [properties];
    }
    var data = {};
    if (props){
        data.properties = props;
    }
    if (additionalProps !== null && typeof additionalProps === "object"){
        var keys = Object.keys(additionalProps);
        for (var j = 0; j < keys.length; j++)
        {
            data[keys[j]] = additionalProps[keys[j]];
        }
    }
    return __getRPC(actionName,data);
}
function __getRPC(method, params){
    var args = {"jsonrpc": "2.0","method": method,"id": 1};
    if (typeof params === "object"){
        args.params = params;
    }
    return args;
}


module.exports = exports;
exports.getMovies = getMovies;
exports.getTVShows = getTVShows;
exports.getInfo = getInfo;
exports.togglePlayPause = togglePlayPause;
exports.stop = stop;
exports.getPlayerStatus = getPlayerStatus;
exports.getActivePlayers = getActivePlayers;
exports.getRecentMovies = getRecentMovies;
exports.getMovieDetails = getMovieDetails;
exports.playMovie = playMovie;
exports.getTVShowDetails = getTVShowDetails;
exports.getTVShowEpisodes = getTVShowEpisodes;
exports.getEpisodeDetails = getEpisodeDetails;
exports.getRecentlyAddedEpisodes = getRecentlyAddedEpisodes;
exports.playEpisode = playEpisode;
exports.seek = seek;