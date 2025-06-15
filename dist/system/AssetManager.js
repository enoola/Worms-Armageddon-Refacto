var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAudioContext, Sound } from "../audio/Sound";
import { Settings } from "../Settings";
import { Maps } from "../environment/Maps";
export const AssetManager = {
    images: {},
    sounds: {},
    numAssetsLoaded: 0,
    imagesToBeLoaded: [
        `${Settings.REMOTE_ASSERT_SERVER}data/images/menu/stick.png`
    ],
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
    isReady() {
        return this.numAssetsLoaded >= this.imagesToBeLoaded.length + this.audioToBeLoaded.length;
    },
    getPerAssetsLoaded() {
        return (this.numAssetsLoaded / (this.imagesToBeLoaded.length + this.audioToBeLoaded.length)) * 100;
    },
    getImage(name) {
        return this.images[name] || new Image(); // fallback for missing image
    },
    getSound(name) {
        return this.sounds[name] || new Sound(null);
    },
    loadImages(sources) {
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
            }
            else {
                console.warn(`Image "${name}" already loaded`);
            }
        }
    },
    loadSounds(sources) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (Settings.BUILD_MANIFEST_FILE)
                    throw new Error("Using manifest");
                ctx: AudioContext;
                // Try Web Audio API first
                audioCtx = getAudioContext();
                if (!audioCtx) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                const bufferLoader = new BufferLoader(Sound.context, sources, (bufferList) => {
                    for (const buffer of bufferList) {
                        this.sounds[buffer.name] = new Sound(buffer.buffer);
                        this.numAssetsLoaded++;
                    }
                });
                bufferLoader.load();
            }
            catch (e) {
                console.warn("Web Audio API not supported, falling back to HTML5 Audio");
                try {
                    for (const src of sources) {
                        const name = this._extractName(src);
                        this.sounds[name] = new (class SoundFallback extends Sound {
                            constructor(src) {
                                super(src);
                                this.src = src;
                                this.sound.loop = false;
                            }
                        })(src);
                        this.numAssetsLoaded++;
                    }
                }
                catch (e) {
                    alert("This browser doesn't support HTML5 audio. Sorry!");
                    this.numAssetsLoaded += sources.length; // skip waiting
                }
            }
        });
    },
    addSpritesDefToLoadList() {
        this._addSpriteGroupToLoadList(Sprites.worms, "data/images/");
        this._addSpriteGroupToLoadList(Sprites.weaponIcons, "data/images/weaponicons/");
        this._addSpriteGroupToLoadList(Sprites.weapons, "data/images/");
        this._addSpriteGroupToLoadList(Sprites.particleEffects, "data/images/");
        this._addMapImagesToLoadList();
    },
    _addSpriteGroupToLoadList(spriteGroup, path) {
        for (const key in spriteGroup) {
            const sprite = spriteGroup[key];
            const imageName = sprite.imageName;
            this.imagesToBeLoaded.push(`${Settings.REMOTE_ASSERT_SERVER}${path}${imageName}.png`);
        }
    },
    _addMapImagesToLoadList() {
        for (const mapKey in Maps) {
            const map = Maps[mapKey];
            this.imagesToBeLoaded.push(`${Settings.REMOTE_ASSERT_SERVER}data/images/levels/${map.terrainImage}.png`);
            this.imagesToBeLoaded.push(`${Settings.REMOTE_ASSERT_SERVER}data/images/levels/${map.smallImage}.png`);
        }
    },
    _extractName(url) {
        const match = url.match(/([a-zA-Z0-9_-]+)\.\w+/);
        return match ? match[1] : url;
    }
};
// Load all assets on init
AssetManager.addSpritesDefToLoadList();
AssetManager.loadImages(AssetManager.imagesToBeLoaded);
AssetManager.loadSounds(AssetManager.audioToBeLoaded);
export default AssetManager;
