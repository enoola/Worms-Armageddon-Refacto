import { Settings } from "@/Settings";
import AssetManager from "@/system/AssetManager";
import { Logger } from "@/utils/logger";
import { Sound } from "./Sound";

/**
 * SoundFallback class (HTML Audio Tag)
 */
export class SoundFallback extends Sound {
    audio: HTMLAudioElement;

    constructor(private soundSrc: string) {
        super(null);
        this.audio = new Audio();
        this.load(soundSrc);
    }

    /**
     * Load sound from URL
     */
    load(soundSrc: string): void {
        this.audio.src = soundSrc;
        this.audio.volume = 1;

        this.audio.addEventListener("canplay", () => {
            AssetManager.numAssetsLoaded++;
            Logger.log(`Sound loaded: ${this.soundSrc}`);
        });

        this.audio.addEventListener("error", () => {
            Logger.error(`Sound failed to load: ${this.soundSrc}`);
        });
    }

    /**
     * Play using HTML Audio
     */
    override play(volume = 1, time = 0, allowSoundOverlap = false): void {
        if (!Settings.SOUND) {
            Logger.debug("Sounds are currently disabled");
            return;
        }

        if (this.playing && !allowSoundOverlap) return;

        this.audio.volume = volume;
        this.audio.currentTime = 0;

        this.audio.play().catch(e => {
            Logger.warn("HTML audio playback failed", e);
        });

        this.playing = true;

        // Detect end of playback
        this.audio.onended = () => {
            this.playing = false;
        };
    }

    /**
     * Pause HTML audio
     */
    override pause(): void {
        if (!Settings.SOUND) return;
        this.audio.pause();
        this.playing = false;
    }

    /**
     * Check if sound is playing
     */
    override isPlaying(): boolean {
        return !this.audio.paused && !this.audio.ended && this.audio.currentTime > 0;
    }
}