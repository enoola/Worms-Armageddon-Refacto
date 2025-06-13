/**
 *  Global settings for the whole game
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */

//import { Utils } from "system/Utils"
import { Logger } from "utils/logger";
// during var declaration e.g: "export var NAMEOFVAR" I mainly replaced 
// with Exported mutable settings e.g: "export let NAMEOFVAR"
//

namespace Settings
{

    //Game vars
    export var PLAYER_TURN_TIME = 45 * 1000; // 60 secounds
    export var TURN_TIME_WARING = 5; // after 10 secounds warn player they are running out of time
   
    //General game settings
    export let SOUND = false;

    //Server details
    export var NODE_SERVER_IP = '96.126.111.211'; 
    export var LEADERBOARD_API_URL = 'http://96.126.111.211'; 
    export var NODE_SERVER_PORT = '8080';

    // development vars
    export let DEVELOPMENT_MODE = false; 
    export var LOG = true;

    //When I want to build the manifest file using 
    // http://westciv.com/tools/manifestR/
    export var BUILD_MANIFEST_FILE = false;

    export var REMOTE_ASSERT_SERVER = "../"; //"../college/fyp/"

    export var API_KEY = "AIzaSyA1aZhcIhRQ2gbmyxV5t9pGK47hGsiIO7U";

    export let PHYSICS_DEBUG_MODE = false;
    export var RUN_UNIT_TEST_ONLY = !true;

    export var NETWORKED_GAME_QUALITY_LEVELS = {
        HIGH: 0,
        MEDIUM: 1,
        LOW: 2
    }

    export var NETWORKED_GAME_QUALITY = NETWORKED_GAME_QUALITY_LEVELS.HIGH;


    // Exported mutable settings


    // Define known boolean flags and how they map to settings
    const BOOLEAN_FLAG_MAPPINGS: Record<string, (value: boolean) => void> = {
        "physicsDebugDraw": (val) => { Settings.PHYSICS_DEBUG_MODE = val; },
        "devMode": (val) => { Settings.DEVELOPMENT_MODE = val; },
        "sound": (val) => { Settings.SOUND = val; }
    };

    // Parses query string into key-value pairs
    export function getUrlVars(): Record<string, string> {
        const vars: Record<string, string> = {};
        const href = window.location.href;

        href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_, key: string, value: string) => {
            vars[key] = decodeURIComponent(value.replace(/\+/g, ' '));
            return '';
        });

        return vars;
    }

    // Applies settings from URL query params
    export function getSettingsFromUrl(): void {
        const argv = getUrlVars();

        // Handle boolean flags
        for (const [key, setValue] of Object.entries(BOOLEAN_FLAG_MAPPINGS)) {
            const rawValue = argv[key];
            if (rawValue !== undefined) {
                const boolValue = rawValue.toLowerCase() === 'true';
                setValue(boolValue);
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
        Logger.log("Notice: Settings parsed from URL:", {
            physicsDebugDraw: argv["physicsDebugDraw"],
            devMode: argv["devMode"],
            unitTest: argv["unitTest"],
            sound: argv["sound"]
        });
    }
}