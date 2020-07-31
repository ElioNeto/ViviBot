var fs            =   require("fs");
var Logger        =   (exports.Logger = {});

var infoStream    =   fs.createWriteStream("./logs/info.log",{flags:'a'})
var errorStream   =   fs.createWriteStream("logs/error.log",{flags:'a'})
var debugStream   =   fs.createWriteStream("logs/debug.log",{flags:'a'})
var serverStream  =   fs.createWriteStream("logs/server.log",{flags:'a'}); 

Logger.info = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";
  infoStream.write(message);
};

Logger.debug = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";
  debugStream.write(message);
};

Logger.error = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";
  errorStream.write(message);
}; 

Logger.server = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";
  serverStream.write(message);
}; 