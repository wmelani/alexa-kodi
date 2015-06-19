/*
 * server/app.js
 */

'use strict';

var config = require(__dirname + '/config/dev.json');
var ultimateRequire = require(__dirname + '/lib/ultimate-require.js');

// Create an app
var app = {
  config: config,
  dir: __dirname,
  controllers : {},
  server: {}
};

// Assign app to exports
exports = module.exports = app;
app.controllers = ultimateRequire(__dirname + "/controllers");


// Run app.servers
app.run = function () {
  require(__dirname + '/lib/server/restify.js').run(app);
  require(__dirname + '/routes.js').register(app,app.server.restify);
  require(__dirname + '/controllers/alexa.js');
};

process.on('uncaughtException',function(e){
  console.log(e, e.stack);
});
