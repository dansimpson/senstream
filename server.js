var redis = require("redis"),
    temp_bus = require("event").EventEmitter,
    redis_client = redis.createClient(6379, "192.168.0.2");

temp_bus.addListener("update", function () {
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