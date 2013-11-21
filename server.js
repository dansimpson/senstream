var redis = require("redis"),
    Events = require("events"),
    temp_bus = new Events.EventEmitter(),
    redis_client = redis.createClient(6379, "192.168.0.2");

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

temp_bus.on("update", function () {
  console.log("emitter update!", this, arguments);
})

redis_client.on("error", function () {
  console.log("ERROR!", arguments);
});

redis_client.on("message", function (channel, message) {
  if(channel === "temperature"){
    temp_bus.emit("update", message);
  }
});

redis_client.on("ready", function () {
  redis_client.subscribe("temperature");
});

// all environments
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
// app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
