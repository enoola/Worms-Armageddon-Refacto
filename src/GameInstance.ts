import { Game } from "./Game";
import { Logger } from "./utils/logger";

//out singleton class from Game 
export class GameInstance {
    private static _gameInstance: Game | null = null;
    private static _accessed = 0;
    private constructor() {
    }

    public static getInstance(): Game {
        this._accessed++
        if (!this._gameInstance) {
            this._gameInstance = new Game();
            Logger.log ("instanciated gameInstance ("+this._accessed+")")
        }
        return (this._gameInstance);
    }
}