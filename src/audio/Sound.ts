/**
 * Sound.js
 * Sound wraps the Web audio api. When a sound file is loaded 
 * one of these is created using the sound buffer. It allows for a 
 * cleaner and simple api for doing basic things like playing sound, controling volume etc
 *
 * SoundFallback use just the simple Audio tag, works ok but not as feature full as web audio api.
 * 
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
/**
 * Old import ///<reference path="../system/Utils.ts"/>
 */

import { Utils } from "../system/Utils"
import { AssetManager } from "../system/AssetManager";
import { Settings } from "../Settings";
import { Logger } from "../utils/logger";

// Polyfill for older browsers
declare const webkitAudioContext: typeof AudioContext;

const AudioContextImpl = window.AudioContext || (webkitAudioContext as any);

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new AudioContextImpl();
    }
    return audioContext;
}

export abstract class Sound {
    protected buffer: AudioBuffer | null = null;
    protected source: AudioBufferSourceNode | null = null;
    protected gainNode: GainNode | null = null;
    protected playing: boolean = false;

    constructor(buffer: AudioBuffer | null) {
        this.buffer = buffer;

        if (!this.buffer) {
            Logger.error("buffer null");
        }
    }

    play(volume: number = 1, time: number = 0, allowSoundOverlay: boolean = false): void {
        if (!Settings.SOUND || !this.buffer) {
            Logger.debug("Sounds are currently disabled or buffer is missing.");
            return;
        }

        if (!this.playing || allowSoundOverlay) {
            this.source = getAudioContext().createBufferSource();
            this.source.buffer = this.buffer;

            this.gainNode = getAudioContext().createGain();
            this.source.connect(this.gainNode);
            this.gainNode.connect(getAudioContext().destination);

            this.gainNode.gain.value = volume;
            this.source.start(time);
            this.playing = true;

            const duration = this.buffer.duration;
            setTimeout(() => {
                this.playing = false;
            }, duration * 1000);
        }
    }

    isPlaying(): boolean {
        return this.playing;
    }

    pause(): void {
        if (Settings.SOUND && this.source) {
            this.source.stop();
            this.playing = false;
        }
    }

    abstract stop(): void;
}