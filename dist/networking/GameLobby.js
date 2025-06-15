/// <reference path="../WormAnimationManger.ts" />
/**
 *
 * GameLobby.js
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
// GameLobby.ts
import { Events } from './Events';
import { ServerUtilities } from './ServerUtilities';
import { Maps } from '../data/Maps'; // Adjust path as needed
import { Game } from '../Game';
import { Player } from '../entities/Player'; // Example
import { Notify } from '../gui/Notify';
import { Logger } from '../system/Logger';
import { Utilies } from '../system/Utils';
export class GameLobby {
    constructor(name, numberOfPlayers, mapName = 'pirates') {
        this.playerIds = [];
        this.name = name;
        this.mapName = mapName;
        this.gameLobbyCapacity = numberOfPlayers;
        this.currentPlayerId = '';
        this.status = GameLobby.LOBBY_STATS.WAITING_FOR_PLAYERS;
    }
    getNumberOfPlayers() {
        return this.gameLobbyCapacity;
    }
    getPlayerSlots() {
        return this.playerIds.length;
    }
    server_init() {
        this.id = ServerUtilities.createToken() + GameLobby.gameLobbiesCounter;
        GameLobby.gameLobbiesCounter++;
    }
    client_init(socket) {
        const Client = {
            socket: socket
        };
        // Start game (host)
        Client.socket.on(Events.gameLobby.START_GAME_HOST, (data) => {
            const gameLobby = Utilies.copy(new GameLobby(null, null), data);
            Game.map = new Map(Maps[gameLobby.mapName]);
            // Update local copy of the lobby
            GameInstance.lobby.client_GameLobby = gameLobby;
            // Start game with player IDs
            GameInstance.start(gameLobby.playerIds);
            // Emit start event to other clients
            Client.socket.emit(Events.gameLobby.START_GAME_FOR_OTHER_CLIENTS, {
                lobby: gameLobby,
                gameData: GameInstance.getGameNetData()
            });
        });
        // Start game for other clients
        Client.socket.on(Events.gameLobby.START_GAME_FOR_OTHER_CLIENTS, (data) => {
            const gameLobby = Utilies.copy(new GameLobby(null, null), data.lobby);
            Game.map = new Map(Maps[gameLobby.mapName]);
            GameInstance.lobby.client_GameLobby = gameLobby;
            for (let i = 0; i < gameLobby.playerIds.length; i++) {
                GameInstance.players.push(new Player(gameLobby.playerIds[i]));
            }
            GameInstance.setGameNetData(data.gameData);
            GameInstance.start();
        });
        // Handle player disconnect
        Client.socket.on(Events.gameLobby.PLAYER_DISCONNECTED, (playerId) => {
            Logger.log(`Events.gameLobby.PLAYER_DISCONNECTED ${playerId}`);
            for (let j = GameInstance.players.length - 1; j >= 0; j--) {
                if (GameInstance.players[j].id === playerId) {
                    Notify.display(`${GameInstance.players[j].getTeam().name} has disconnected`, "Looks like you were too much competition for them. They just gave up, well done!! Although they might have just lost connection... though we will say you won =)", 13000);
                    const worms = GameInstance.players[j].getTeam().getWorms();
                    for (let i = 0; i < worms.length; i++) {
                        worms[i].hit(999, null, true);
                    }
                    // Trigger next turn if current player left
                    if (GameInstance.players[j].id === GameInstance.state.getCurrentPlayer().id) {
                        GameInstance.state.triggerNextTurn();
                    }
                    return;
                }
            }
        });
    }
    contains(playerId) {
        return this.playerIds.includes(playerId);
    }
    isLobbyEmpty() {
        return this.playerIds.length === 0;
    }
    join(userId, googleUserId, socket) {
        if (!this.contains(userId) && this.status === GameLobby.LOBBY_STATS.WAITING_FOR_PLAYERS) {
            console.log(`Player ${googleUserId} added to gamelobby ${this.id}, name: ${this.name}`);
            socket.join(this.id);
            this.currentPlayerId = userId;
            socket.set(SOCKET_STORAGE_GAMELOBBY_ID, this.id);
            this.playerIds.push(userId);
            if (this.isFull()) {
                socket.emit(Events.gameLobby.START_GAME_HOST, this);
                this.status = GameLobby.LOBBY_STATS.GAME_IN_PLAY;
            }
            else {
                this.status = GameLobby.LOBBY_STATS.WAITING_FOR_PLAYERS;
            }
        }
    }
    remove(userId) {
        const index = this.playerIds.indexOf(userId);
        if (index >= 0) {
            this.playerIds.splice(index, 1);
        }
    }
    isFull() {
        return this.gameLobbyCapacity === this.playerIds.length;
    }
}
GameLobby.LOBBY_STATS = {
    WAITING_FOR_PLAYERS: 0,
    GAME_IN_PLAY: 1
};
GameLobby.gameLobbiesCounter = 0;
// For legacy support, if needed
const SOCKET_STORAGE_GAMELOBBY_ID = 'gameLobbyId';
export { SOCKET_STORAGE_GAMELOBBY_ID };
