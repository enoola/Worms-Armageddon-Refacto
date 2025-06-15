"use strict";
var ServerSettings;
(function (ServerSettings) {
    ServerSettings.DEVELOPMENT_MODE = false;
    ServerSettings.MAX_PLAYERS_PER_LOBBY = 4;
    ServerSettings.MAX_USERS = 1000;
    ServerSettings.LEADERBOARDS_API = "http://96.126.111.211/";
})(ServerSettings || (ServerSettings = {}));
if (typeof exports != 'undefined') {
    (module).exports = ServerSettings;
}
