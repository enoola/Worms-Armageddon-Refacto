import { Camera } from "@/system/Camera";
import { Graphics } from "@/system/Graphics";
import { AssetManager } from "@/system/AssetManager";
import { Physics } from "@/system/Physics";
import { Worm } from "@/Worm";
import { Utils } from "@/system/Utils";
import { Settings } from "@/Settings";
import { Timer } from "@/system/Timer";
import { Player } from "@/Player";
import { Game } from "@/Game";
import { GameInstance } from "./GameInstance";

/**
 * GameStateManager
 * 
 * Manages game state, turn switching, and win conditions
 * So I would like GameInstance to be accessible from GameStateManager
 */
export class GameStateManager {
    private nextTurnTrigger = false;
    private currentPlayerIndex = 0;
    private players: Player[] = [];
    public isStarted = false;
    private physicsWorldSettled = false;

    constructor() { }

    /**
     * Initialize game state with players
     */
    init(players: Player[]): void {
        this.players = players;
        this.isStarted = true;
    }

    /**
     * Triggers the next turn
     */
    triggerNextTurn(): void {
        // Stop all game info effects (e.g., bouncing arrows)
        GameInstance.getInstance().miscellaneousEffects.stopAll();
        this.nextTurnTrigger = true;
    }

    /**
     * Handles turn switching when timer ends
     */
    timerTriggerNextTurn(): void {
        GameInstance.getInstance().wormManager.deactivateAllNonTimeBasedWeapons();
        this.triggerNextTurn();
    }

    /**
     * Check if a turn switch has been triggered
     */
    hasNextTurnBeenTriggered(): boolean {
        return this.nextTurnTrigger;
    }

    /**
     * Check if the game is ready for the next turn
     */
    readyForNextTurn(): boolean {
        if (this.nextTurnTrigger) {
            // Check animations, deaths, and player stability
            if (
                GameInstance.getInstance().particleEffectMgmt.areAllAnimationsFinished() &&
                GameInstance.getInstance().wormManager.areAllWormsReadyForNextTurn()
            ) {
                this.nextTurnTrigger = false;
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the current player
     */
    getCurrentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    /**
     * Selects the next player and worm
     * Returns player ID or null if team is dead
     */
    nextPlayer(): number | null {
        this.nextTurnTrigger = false;

        if (this.currentPlayerIndex + 1 === this.players.length) {
            this.currentPlayerIndex = 0;
        } else {
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
    checkForWinner(): Player | null {
        const playersStillLive = this.players.filter(
            (player) => !player.getTeam().areAllWormsDead()
        );

        if (playersStillLive.length === 1) {
            return playersStillLive[0];
        }

        return null;
    }
}