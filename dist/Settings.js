/**
 *  Global settings for the whole game
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
import { Logger } from "./utils/logger";
//import { Utils } from "system/Utils"
//import { Logger } from "utils/Logger";
// during var declaration e.g: "export var NAMEOFVAR" I mainly replaced 
// with Exported mutable settings e.g: "export let NAMEOFVAR"
export var Settings;
(function (Settings) {
    //Game vars
    Settings.PLAYER_TURN_TIME = 45 * 1000; // 60 secounds
    Settings.TURN_TIME_WARING = 5; // after 10 secounds warn player they are running out of time
    //General game settings
    Settings.SOUND = false;
    //Server details
    Settings.NODE_SERVER_IP = '96.126.111.211';
    Settings.LEADERBOARD_API_URL = 'http://96.126.111.211';
    Settings.NODE_SERVER_PORT = '8080';
    // development vars
    Settings.DEVELOPMENT_MODE = false;
    Settings.LOG = true;
    //When I want to build the manifest file using 
    // http://westciv.com/tools/manifestR/
    Settings.BUILD_MANIFEST_FILE = false;
    Settings.REMOTE_ASSERT_SERVER = "../"; //"../college/fyp/"
    Settings.API_KEY = "AIzaSyA1aZhcIhRQ2gbmyxV5t9pGK47hGsiIO7U";
    Settings.PHYSICS_DEBUG_MODE = false;
    Settings.RUN_UNIT_TEST_ONLY = !true;
    Settings.NETWORKED_GAME_QUALITY_LEVELS = {
        HIGH: 0,
        MEDIUM: 1,
        LOW: 2
    };
    Settings.NETWORKED_GAME_QUALITY = Settings.NETWORKED_GAME_QUALITY_LEVELS.HIGH;
    // Exported mutable settings
    // Define known boolean flags and how they map to settings
    const BOOLEAN_FLAG_MAPPINGS = {
        "physicsDebugDraw": (val) => { Settings.PHYSICS_DEBUG_MODE = val; },
        "devMode": (val) => { Settings.DEVELOPMENT_MODE = val; },
        "sound": (val) => { Settings.SOUND = val; }
    };
    // Parses query string into key-value pairs
    function getUrlVars() {
        const vars = {};
        const href = window.location.href;
        href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_, key, value) => {
            vars[key] = decodeURIComponent(value.replace(/\+/g, ' '));
            return '';
        });
        return vars;
    }
    Settings.getUrlVars = getUrlVars;
    // Applies settings from URL query params
    function getSettingsFromUrl() {
        const argv = getUrlVars();
        // Handle boolean flags
        /*
        for (const [key, setValue] of Object.entries(BOOLEAN_FLAG_MAPPINGS)) {
            const rawValue = argv[key];
            if (rawValue !== undefined) {
                const boolValue = rawValue.toLowerCase() === 'true';
                setValue(boolValue);
            }
        }
        */
        // some of this 
        // view: https://chat.qwen.ai/s/6baed45c-fdbd-4291-a7c5-56e63fd9a823?fev=0.0.111
        for (const key in BOOLEAN_FLAG_MAPPINGS) {
            if (BOOLEAN_FLAG_MAPPINGS.hasOwnProperty(key)) {
                const setValue = BOOLEAN_FLAG_MAPPINGS[key];
                const rawValue = argv[key];
                if (rawValue !== undefined) {
                    const boolValue = rawValue.toLowerCase() === 'true';
                    setValue(boolValue);
                }
            }
        }
        // Special case: unitTest opens a test window
        if (argv["unitTest"] !== undefined) {
            const shouldRunTests = argv["unitTest"].toLowerCase() === 'true';
            if (shouldRunTests) {
                const testWindow = window.open('test.html', '|UnitTests', 'height=1000,width=700,top=100%');
                if (testWindow) {
                    testWindow.location.reload(); // Refresh existing window
                }
            }
        }
        // Log what was parsed
        Logger.log("Notice: Settings parsed from URL:" + {
            physicsDebugDraw: argv["physicsDebugDraw"],
            devMode: argv["devMode"],
            unitTest: argv["unitTest"],
            sound: argv["sound"]
        });
    }
    Settings.getSettingsFromUrl = getSettingsFromUrl;
})(Settings || (Settings = {}));
