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
import { Settings } from "../Settings";
import { Logger } from "../utils/logger";
const AudioContextImpl = window.AudioContext || webkitAudioContext;
export let audioContext = null;
export function getAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContextImpl();
    }
    return audioContext;
}
export class Sound {
    constructor(buffer) {
        this.buffer = null;
        this.source = null;
        this.gainNode = null;
        this.playing = false;
        this.buffer = buffer;
        if (!this.buffer) {
            Logger.error("buffer null");
        }
    }
    play(volume = 1, time = 0, allowSoundOverlay = false) {
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
    isPlaying() {
        return this.playing;
    }
    pause() {
        if (Settings.SOUND && this.source) {
            this.source.stop();
            this.playing = false;
        }
    }
}
