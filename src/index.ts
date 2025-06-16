// main.ts

import { Settings } from './Settings';
import { Graphics } from './system/Graphics';
import { StartMenu } from './gui/StartMenu';
import { Game } from './Game';
import AssetManager from './system/AssetManager';
import { GameInstance } from "@/GameInstance";

declare const $: any; // If still using jQuery, keep the declaration


$(document).ready(() => {
    Settings.getSettingsFromUrl();

    if (!Settings.RUN_UNIT_TEST_ONLY) {
        
        const startMenu = new StartMenu( GameInstance.getInstance());
        //below already done at the end of AssetManager.ts
        //AssetManager.loadAssets();

        startMenu.onGameReady(() => {
            startMenu.hide();

            if (!GameInstance.getInstance().state.isStarted) {
                GameInstance.getInstance().start();
            }

            function gameloop() {
                if (Settings.DEVELOPMENT_MODE) {
                    Graphics.stats?.update(); // Optional chaining in case stats is null
                }

                GameInstance.getInstance().step();
                GameInstance.getInstance().update();
                GameInstance.getInstance().draw();

                window.requestAnimationFrame(gameloop);
            }

            gameloop();
        });
    }
});
