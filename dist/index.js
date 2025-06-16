// main.ts
import { Settings } from './Settings';
import { Graphics } from './system/Graphics';
import { StartMenu } from './gui/StartMenu';
import { GameInstance } from "@/GameInstance";
$(document).ready(() => {
    Settings.getSettingsFromUrl();
    if (!Settings.RUN_UNIT_TEST_ONLY) {
        const startMenu = new StartMenu(GameInstance.getInstance());
        //below already done at the end of AssetManager.ts
        //AssetManager.loadAssets();
        startMenu.onGameReady(() => {
            startMenu.hide();
            if (!GameInstance.getInstance().state.isStarted) {
                GameInstance.getInstance().start();
            }
            function gameloop() {
                var _a;
                if (Settings.DEVELOPMENT_MODE) {
                    (_a = Graphics.stats) === null || _a === void 0 ? void 0 : _a.update(); // Optional chaining in case stats is null
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
