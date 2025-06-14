// main.ts

import { Settings } from './Settings';
import { Graphics } from './system/Graphics';
import { StartMenu } from './gui/StartMenu';
import { Game } from './Game';

let GameInstance: Game;

$(document).ready(() => {
    Settings.getSettingsFromUrl();

    if (!Settings.RUN_UNIT_TEST_ONLY) {
        const startMenu = new StartMenu();
        GameInstance = new Game();
        AssetManager.loadAssets();

        startMenu.onGameReady(() => {
            startMenu.hide();

            if (!GameInstance.state.isStarted) {
                GameInstance.start();
            }

            function gameloop() {
                if (Settings.DEVELOPMENT_MODE) {
                    Graphics.stats?.update(); // Optional chaining in case stats is null
                }

                GameInstance.step();
                GameInstance.update();
                GameInstance.draw();

                window.requestAnimationFrame(gameloop);
            }

            gameloop();
        });
    }
});