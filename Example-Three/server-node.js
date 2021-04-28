process.title = "websocket-server";
var webSocketServer = require("websocket").server;
const socketIO = require("socket.io");
var http = require("http");
var fs = require("fs");

const webSocketsServerPort = 8080;
var clients = [];

// http server
var server = http.createServer(function (request, response) {});
server.listen(webSocketsServerPort, function () {
  console.log(
    new Date() + " Server is listening on port " + webSocketsServerPort + "."
  );
});

// websocket server is tied to http server
var wsServer = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  // authentication of client should go here
  return true;
}

// callback every time someone tries to connect to the WebSocket server
wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }
  console.log(new Date() + " Connection from origin " + request.origin + ".");
  var connection = request.accept(null, request.origin);
  connection.write = connection.send;
  connection.read = connection.socket.read;

  // we need to know client index to remove them on 'close' event
  var index = clients.push(connection) - 1;

  var userName = false;

  console.log(new Date() + " Connection accepted to client: " + index);

  let buf = "";
  // user sent some message
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log(new Date() + " Received Message: " + message.utf8Data);
      buf += message.utf8Data;
      if (message.utf8Data === "\r") {
        console.log("You wrote:", buf);
        connection.sendUTF(buf + "\r\n");
        buf = "";
      }
    }
  });

  // user disconnected
  connection.on("close", function (connection) {
    console.log("Connection closed for client index: " + index);
    clients.splice(index, 1);
  });
});
