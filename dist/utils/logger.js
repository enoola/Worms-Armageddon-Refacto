import { Settings } from "../Settings";
/**
 * @namespace Logger
 * @description Utility functions picked from utils.ts file and refactored with qwen
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */
export const Logger = {
    log(message) {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
            console.info(message);
    },
    warn(message) {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
            console.warn(message);
    },
    debug(message) {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
            console.log(message);
    },
    error(message) {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
            console.error(message);
    }
};
