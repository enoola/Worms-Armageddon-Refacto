import { getAudioContext, Sound } from "../audio/Sound";
import { Settings } from "../Settings";
import { Sprite } from "../animation/Sprite";
import { Maps } from "../environment/Maps";

export const AssetManager = {
    images: {} as Record<string, HTMLImageElement>,
    sounds: {} as Record<string, Sound>,

    numAssetsLoaded: 0,
    imagesToBeLoaded: [
        `${Settings.REMOTE_ASSERT_SERVER}data/images/menu/stick.png`
    ] as string[],
    audioToBeLoaded: [
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/CursorSelect.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/explosion1.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/explosion2.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/explosion3.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/WalkExpand.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/WalkCompress.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/drill.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/JUMP1.WAV`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/TIMERTICK.WAV`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/holygrenade.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/hurry.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/ohdear.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/fire.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/victory.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/ow1.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/ow2.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/ow3.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/byebye.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/traitor.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/youllregretthat.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/justyouwait.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/watchthis.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/fatality.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/laugh.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/incoming.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/grenade.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/yessir.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/cantclickhere.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/StartRound.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/JetPackLoop1.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/JetPackLoop2.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/fuse.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/fanfare/Ireland.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/NinjaRopeFire.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/NinjaRopeImpact.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/ROCKETPOWERUP.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/HOLYGRENADEIMPACT.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/GRENADEIMPACT.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/WormLanding.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/THROWPOWERUP.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/THROWRELEASE.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/SHOTGUNRELOAD.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/ShotGunFire.wav`,
        `${Settings.REMOTE_ASSERT_SERVER}data/sounds/MiniGunFire.wav`
    ],

    isReady(): boolean {
        return this.numAssetsLoaded >= this.imagesToBeLoaded.length + this.audioToBeLoaded.length;
    },

    getPerAssetsLoaded(): number {
        return (this.numAssetsLoaded / (this.imagesToBeLoaded.length + this.audioToBeLoaded.length)) * 100;
    },

    getImage(name: string): HTMLImageElement {
        return this.images[name] || new Image(); // fallback for missing image
    },

    getSound(name: string): Sound {
        return this.sounds[name] || new Sound(null);
    },

    loadImages(sources: string[]): void {
        let loadedImages = 0;
        const totalImages = sources.length;

        for (const src of sources) {
            const name = this._extractName(src);
            if (!this.images[name]) {
                const img = new Image();
                img.src = src;

                img.onload = () => {
                    this.images[name] = img;
                    loadedImages++;
                    this.numAssetsLoaded++;

                    if (loadedImages === totalImages) {
                        console.log("All images loaded successfully");
                    }
                };

                img.onerror = () => {
                    console.error(`Failed to load image: ${src}`);
                    loadedImages++;
                    this.numAssetsLoaded++;
                };
            } else {
                console.warn(`Image "${name}" already loaded`);
            }
        }
    },

    async loadSounds(sources: string[]): Promise<void> {
        try {
            if (Settings.BUILD_MANIFEST_FILE) throw new Error("Using manifest");
            ctx: AudioContext
            // Try Web Audio API first
            audioCtx=getAudioContext()
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const bufferLoader = new BufferLoader(Sound.context, sources, (bufferList: any[]) => {
                for (const buffer of bufferList) {
                    this.sounds[buffer.name] = new Sound(buffer.buffer);
                    this.numAssetsLoaded++;
                }
            });

            bufferLoader.load();

        } catch (e) {
            console.warn("Web Audio API not supported, falling back to HTML5 Audio");

            try {
                for (const src of sources) {
                    const name = this._extractName(src);
                    this.sounds[name] = new (class SoundFallback extends Sound {
                        constructor(public src: string) {
                            super(src);
                            this.sound.loop = false;
                        }
                    })(src);

                    this.numAssetsLoaded++;
                }
            } catch (e) {
                alert("This browser doesn't support HTML5 audio. Sorry!");
                this.numAssetsLoaded += sources.length; // skip waiting
            }
        }
    },

    addSpritesDefToLoadList(): void {
        this._addSpriteGroupToLoadList(Sprites.worms, "data/images/");
        this._addSpriteGroupToLoadList(Sprites.weaponIcons, "data/images/weaponicons/");
        this._addSpriteGroupToLoadList(Sprites.weapons, "data/images/");
        this._addSpriteGroupToLoadList(Sprites.particleEffects, "data/images/");
        this._addMapImagesToLoadList();
    },

    _addSpriteGroupToLoadList(spriteGroup: Record<string, any>, path: string): void {
        for (const key in spriteGroup) {
            const sprite = spriteGroup[key];
            const imageName = sprite.imageName;
            this.imagesToBeLoaded.push(`${Settings.REMOTE_ASSERT_SERVER}${path}${imageName}.png`);
        }
    },

    _addMapImagesToLoadList(): void {
        for (const mapKey in Maps) {
            const map = Maps[mapKey];
            this.imagesToBeLoaded.push(`${Settings.REMOTE_ASSERT_SERVER}data/images/levels/${map.terrainImage}.png`);
            this.imagesToBeLoaded.push(`${Settings.REMOTE_ASSERT_SERVER}data/images/levels/${map.smallImage}.png`);
        }
    },

    _extractName(url: string): string {
        const match = url.match(/([a-zA-Z0-9_-]+)\.\w+/);
        return match ? match[1] : url;
    }
};

// Load all assets on init
AssetManager.addSpritesDefToLoadList();
AssetManager.loadImages(AssetManager.imagesToBeLoaded);
AssetManager.loadSounds(AssetManager.audioToBeLoaded);

export default AssetManager;