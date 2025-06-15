// main.ts
import { Settings } from './Settings';
import { Graphics } from './system/Graphics';
import { StartMenu } from './gui/StartMenu';
import { Game } from './Game';
let GameInstance;
$(document).ready(() => {
    Settings.getSettingsFromUrl();
    if (!Settings.RUN_UNIT_TEST_ONLY) {
        GameInstance = new Game();
        const startMenu = new StartMenu(GameInstance);
        AssetManager.loadAssets();
        startMenu.onGameReady(() => {
            startMenu.hide();
            if (!GameInstance.state.isStarted) {
                GameInstance.start();
            }
            function gameloop() {
                var _a;
                if (Settings.DEVELOPMENT_MODE) {
                    (_a = Graphics.stats) === null || _a === void 0 ? void 0 : _a.update(); // Optional chaining in case stats is null
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
