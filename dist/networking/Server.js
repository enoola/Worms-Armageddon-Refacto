"use strict";
///<reference path="ServerUtilies.ts"/>
///<reference path="GameLobby.ts"/>
///<reference path="Events.ts"/>
///<reference path="Lobby.ts"/>
///<reference path="BandwidthMonitor.ts"/>
//var io;
// HACK
// Had to give up the benfits of types in this instance, as a problem with the way ES6 proposal module system
// works with Node.js modules. http://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export
try {
    var Events = require('./Events');
    var ServerUtilies = require('./ServerUtilies');
    var GameLobby = require('./GameLobby');
    var ServerSettings = require('./ServerSettings');
    var Lobby = require('./Lobby');
    var Util = require('util');
    var BandwidthMonitor = require('./BandwidthMonitor');
}
catch (error) { }
class GameServer {
    constructor(port) {
        this.bandwidthMonitor = new BandwidthMonitor(true);
        io = require('socket.io').listen(port);
        this.lobby = new Lobby();
        io.sockets.on('connection', function (socket) { }, {
            this: .lobby.onConnection(socket, io),
            this: .lobby.server_init(socket, io),
            this: .lobby.onDisconnection(socket, io),
            //This allows the clients to get the  current time of the server
            socket, : .on(Events.client.GET_GAME_TIME, function (msg, func) { }, {
                func(Date) { }, : .now()
            })
        });
    }
    ;
}
this.init();
init();
{
    // Setup a default lobby
    //this.lobby.server_createGameLobby("Default", 2);
}
var serverInstance = new GameServer(8080);
exports.instance = serverInstance;
