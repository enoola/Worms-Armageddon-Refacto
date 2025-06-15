"use strict";
///<reference path="LeaderBoardApi.ts"/>
var express = require('express');
var app = express();
var LBApi = require('./LeaderBoardApi');
var settings = {
    port: 80,
    database: "wormsGame",
    userTable: "users",
    apiKey: "AIzaSyA1aZhcIhRQ2gbmyxV5t9pGK47hGsiIO7U"
};
var api = new LBApi(settings);
app.get('/findUserIdByToken/:token', function (req, res) {
    var authToken = req.params.token;
    api.findUsersIdByToken(authToken, function (userId) { }, {
        res, : .send(userId)
    });
});
app.get('/getLeaderBoard', function (req, res) { api.getLeaderBoard(req, res); });
app.get('/updateUser/:token', function (req, res) { api.updateUser(req, res); });
app.get('/remove/:token', function (req, res) { api.remove(req, res); });
app.listen(settings.port);
console.log('Listening on ' + settings.port);
