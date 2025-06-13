import { Settings } from "../Settings";

export const Logger = {
    log(message: string): void {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG) console.info(message);
    },
    warn(message: string): void {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG) console.warn(message);
    },
    debug(message: string): void {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG) console.log(message);
    },
    error(message: string): void {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG) console.error(message);
    }
};