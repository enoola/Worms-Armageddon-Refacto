import { Settings } from "../Settings";
import { Game } from "../Game";
import { GameInstance } from "../GameInstance"; // Assuming GameInstance is exported
import { Timer } from "../system/Timer";
import { NetworkTimer } from "../networking/NetworkTimer";
import { AssetManager } from "../system/AssetManager";
import $ from "jquery";
export class CountDownTimer {
    constructor() {
        // Use proper enum access
        const isOnlineGame = GameInstance.gameType === Game.types.ONLINE_GAME;
        this.timer = isOnlineGame
            ? new NetworkTimer(Settings.PLAYER_TURN_TIME)
            : new Timer(Settings.PLAYER_TURN_TIME);
        this.previousSecond = this.timer.timePeriod;
        $('#turnTimeCounter').hide();
    }
    show() {
        $('#turnTimeCounter').show();
    }
    update() {
        if (Settings.DEVELOPMENT_MODE) {
            this.timer.pause();
        }
        this.timer.update();
        const timeLeft = Math.floor(this.timer.getTimeLeft() / 1000);
        if (timeLeft !== this.previousSecond && timeLeft >= 0) {
            if (timeLeft === 5) {
                AssetManager.getSound("hurry").play();
            }
            this.previousSecond = timeLeft;
            $('#turnTimeCounter').html(timeLeft);
            if (timeLeft < Settings.TURN_TIME_WARNING && timeLeft >= 0) {
                $('#turnTimeCounter').css("background", "red");
                AssetManager.getSound("TIMERTICK").play(0.3);
            }
            else {
                $('#turnTimeCounter').css("background", "black");
            }
        }
        if (this.timer.hasTimePeriodPassed(false)) {
            this.timer.pause();
            // Fix potential typo in method name
            GameInstance.state.timerTriggerNextTurn();
        }
    }
}
