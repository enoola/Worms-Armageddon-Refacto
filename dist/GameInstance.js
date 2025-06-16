import { Game } from "./Game";
import { Logger } from "./utils/logger";
//out singleton class from Game 
export class GameInstance {
    constructor() {
    }
    static getInstance() {
        this._accessed++;
        if (!this._gameInstance) {
            this._gameInstance = new Game();
            Logger.log("instanciated gameInstance (" + this._accessed + ")");
        }
        return (this._gameInstance);
    }
}
GameInstance._gameInstance = null;
GameInstance._accessed = 0;
