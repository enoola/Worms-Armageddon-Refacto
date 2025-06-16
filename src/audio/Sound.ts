import { Settings } from "@/Settings";
import { AssetManager } from "@/system/AssetManager";
import { Logger } from "@/utils/logger";

/**
 * Sound class (Web Audio API)
 */
export class Sound {
    static context: AudioContext | null = null;
    source: AudioBufferSourceNode | null = null;
    buffer: AudioBuffer | null = null;
    playing = false;

    constructor(buffer: AudioBuffer | null) {
        this.buffer = buffer;
        this.playing = false;
    }

    /**
     * Play the sound using Web Audio API
     */
    play(volume = 1, time = 0, allowSoundOverlap = false): void {
        if (!Settings.SOUND || !this.buffer) {
            Logger.debug("Sounds are currently disabled");
            return;
        }

        if (this.playing && !allowSoundOverlap) return;

        try {
            if (!Sound.context) {
                Sound.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            this.source = Sound.context.createBufferSource();
            this.source.buffer = this.buffer;

            const gainNode = Sound.context.createGain();
            this.source.connect(gainNode);
            gainNode.connect(Sound.context.destination);

            gainNode.gain.value = volume;
            this.source.start(time);
            this.playing = true;

            // Use onended instead of setTimeout for accuracy
            this.source.onended = () => {
                this.playing = false;
            };

        } catch (e) {
            Logger.error("Web Audio API not supported", e);
            this.fallbackPlay(volume);
        }
    }

    /**
     * Fallback method for older browsers
     */
    private fallbackPlay(volume: number): void {
        if (!this.buffer) return;

        const audio = new Audio();
        audio.src = URL.createObjectURL(
            //new Blob([this.buffer!.toWAV()], { type: "audio/wav" })
            new Blob([this.audioBufferToWAV(this.buffer)])
        );
        audio.volume = volume;
        audio.play().catch(e => {
            Logger.error("Audio playback failed"+ e);
        });
    }

    /**
     * Check if sound is currently playing
     */
    isPlaying(): boolean {
        return this.playing;
    }

    /**
     * Pause playback
     */
    pause(): void {
        if (!Settings.SOUND) return;

        if (this.source) {
            this.source.stop(0);
            this.playing = false;
        }
    }

    // Add to Sound class
    private audioBufferToWAV(buffer: AudioBuffer): Blob {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2 + 44;
        const bufferArray = new ArrayBuffer(length);
        const view = new DataView(bufferArray);
        const channels = [];
        let offset = 0;

        for (let i = 0; i < numOfChan; i++) {
            channels.push(buffer.getChannelData(i));
        }

        // Write WAV header
        this.writeUTFBytes(view, 0, "RIFF");
        view.setUint32(4, 36 + buffer.length * 2, true);
        this.writeUTFBytes(view, 8, "WAVE");
        this.writeUTFBytes(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM format
        view.setUint16(22, buffer.numberOfChannels, true);
        view.setUint32(24, buffer.sampleRate, true);
        view.setUint32(28, buffer.sampleRate * 2, true);
        view.setUint16(32, buffer.numberOfChannels * 2, true);
        view.setUint16(34, 16, true); // 16-bit
        this.writeUTFBytes(view, 36, "data");
        view.setUint32(40, buffer.length * 2, true);

        // Write actual data
        const interleaver = function (view: DataView, offset: number, input: Float32Array[]) {
            const lng = input[0].length;
            const bufferLength = input[0].length * 2 * input.length;
            const output = new Uint8Array(bufferLength);

            for (let i = 0; i < lng; i++) {
                for (let c = 0; c < input.length; c++) {
                    const sample = Math.max(-1, Math.min(1, input[c][i]));
                    const sampleInt16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                    view.setInt16(44 + i * 2, sampleInt16, true);
                }
            }
        };

        return new Blob([view], { type: "audio/wav" });
    }

    private writeUTFBytes(view: DataView, offset: number, str: string): void {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    }
}