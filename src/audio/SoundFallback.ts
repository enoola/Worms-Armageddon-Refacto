/**
 * @namespace SoundFallback
 * @description Sound Fallback extracted from Sound.ts & refactored
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */

import { Logger } from "../utils/logger";
import { AssetManager } from "../system/AssetManager";
import { Sound } from "./Sound";
import { Settings } from "../Settings";

export class SoundFallback extends Sound {
    private audio: HTMLAudioElement;

    constructor(soundSrc: string) {
        super(null); // No buffer needed
        this.audio = document.createElement("audio");
        this.load(soundSrc);
    }

    private load(soundSrc: string): void {
        this.audio.src = soundSrc;
        this.audio.preload = "auto";

        this.audio.addEventListener("loadeddata", () => {
            AssetManager.numAssetsLoaded++;
            Logger.log("Sound loaded: " + this.audio.src);
        });

        this.audio.addEventListener("error", () => {
            Logger.error("Sound failed to load: " + this.audio.src);
        });

        document.body.appendChild(this.audio);
    }

    override play(volume: number = 1, _time: number = 0, allowSoundOverlay: boolean = false): void {
        if (!Settings.SOUND) {
            Logger.debug("Sounds are currently disabled");
            return;
        }

        if (!this.playing || allowSoundOverlay) {
            this.audio.volume = volume;
            this.audio.currentTime = 0; // Restart playback
            this.audio.play().catch(e => Logger.error("Audio play failed", e));
            this.playing = true;
        }
    }

    override pause(): void {
        if (Settings.SOUND) {
            this.audio.pause();
            this.playing = false;
        }
    }

    override stop(): void {
        this.pause();
        this.audio.currentTime = 0;
    }
}