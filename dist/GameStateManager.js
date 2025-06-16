import { Physics } from "@/system/Physics";
import { GameInstance } from "./GameInstance";
/**
 * GameStateManager
 *
 * Manages game state, turn switching, and win conditions
 * So I would like GameInstance to be accessible from GameStateManager
 */
export class GameStateManager {
    constructor() {
        this.nextTurnTrigger = false;
        this.currentPlayerIndex = 0;
        this.players = [];
        this.isStarted = false;
        this.physicsWorldSettled = false;
    }
    /**
     * Initialize game state with players
     */
    init(players) {
        this.players = players;
        this.isStarted = true;
    }
    /**
     * Triggers the next turn
     */
    triggerNextTurn() {
        // Stop all game info effects (e.g., bouncing arrows)
        GameInstance.getInstance().miscellaneousEffects.stopAll();
        this.nextTurnTrigger = true;
    }
    /**
     * Handles turn switching when timer ends
     */
    timerTriggerNextTurn() {
        GameInstance.getInstance().wormManager.deactivateAllNonTimeBasedWeapons();
        this.triggerNextTurn();
    }
    /**
     * Check if a turn switch has been triggered
     */
    hasNextTurnBeenTriggered() {
        return this.nextTurnTrigger;
    }
    /**
     * Check if the game is ready for the next turn
     */
    readyForNextTurn() {
        if (this.nextTurnTrigger) {
            // Check animations, deaths, and player stability
            if (GameInstance.getInstance().particleEffectMgmt.areAllAnimationsFinished() &&
                GameInstance.getInstance().wormManager.areAllWormsReadyForNextTurn()) {
                this.nextTurnTrigger = false;
                return true;
            }
        }
        return false;
    }
    /**
     * Returns the current player
     */
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
    /**
     * Selects the next player and worm
     * Returns player ID or null if team is dead
     */
    nextPlayer() {
        this.nextTurnTrigger = false;
        if (this.currentPlayerIndex + 1 === this.players.length) {
            this.currentPlayerIndex = 0;
        }
        else {
            this.currentPlayerIndex++;
        }
        const currentTeam = this.getCurrentPlayer().getTeam();
        if (currentTeam.getPercentageHealth() <= 0) {
            return null;
        }
        currentTeam.nextWorm();
        GameInstance.getInstance().camera.cancelPan();
        const worm = currentTeam.getCurrentWorm();
        const position = Physics.vectorMetersToPixels(worm.body.GetPosition());
        GameInstance.getInstance().camera.panToPosition(position);
        return this.getCurrentPlayer().id;
    }
    /**
     * Checks for a winning player
     */
    checkForWinner() {
        const playersStillLive = this.players.filter((player) => !player.getTeam().areAllWormsDead());
        if (playersStillLive.length === 1) {
            return playersStillLive[0];
        }
        return null;
    }
}
