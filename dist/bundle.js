/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Game.ts":
/*!*********************!*\
  !*** ./src/Game.ts ***!
  \*********************/
/***/ (() => {

throw new Error("Module parse failed: Unexpected token (49:18)\nFile was processed with these loaders:\n * ./node_modules/ts-loader/index.js\nYou may need an additional loader to handle the result of these loaders.\n|         //If the window gets resize, resize the canvas\n|         $(window).resize(function () { }, {\n>             this: .setupCanvas()\n|         });\n|         //If we go full screen also resize");

/***/ }),

/***/ "./src/Settings.ts":
/*!*************************!*\
  !*** ./src/Settings.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Settings: () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/logger */ "./src/utils/logger.ts");
/**
 *  Global settings for the whole game
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */

//import { Utils } from "system/Utils"
//import { Logger } from "utils/Logger";
// during var declaration e.g: "export var NAMEOFVAR" I mainly replaced 
// with Exported mutable settings e.g: "export let NAMEOFVAR"
var Settings;
(function (Settings) {
    //Game vars
    Settings.PLAYER_TURN_TIME = 45 * 1000; // 60 secounds
    Settings.TURN_TIME_WARING = 5; // after 10 secounds warn player they are running out of time
    //General game settings
    Settings.SOUND = false;
    //Server details
    Settings.NODE_SERVER_IP = '96.126.111.211';
    Settings.LEADERBOARD_API_URL = 'http://96.126.111.211';
    Settings.NODE_SERVER_PORT = '8080';
    // development vars
    Settings.DEVELOPMENT_MODE = false;
    Settings.LOG = true;
    //When I want to build the manifest file using 
    // http://westciv.com/tools/manifestR/
    Settings.BUILD_MANIFEST_FILE = false;
    Settings.REMOTE_ASSERT_SERVER = "../"; //"../college/fyp/"
    Settings.API_KEY = "AIzaSyA1aZhcIhRQ2gbmyxV5t9pGK47hGsiIO7U";
    Settings.PHYSICS_DEBUG_MODE = false;
    Settings.RUN_UNIT_TEST_ONLY = !true;
    Settings.NETWORKED_GAME_QUALITY_LEVELS = {
        HIGH: 0,
        MEDIUM: 1,
        LOW: 2
    };
    Settings.NETWORKED_GAME_QUALITY = Settings.NETWORKED_GAME_QUALITY_LEVELS.HIGH;
    // Exported mutable settings
    // Define known boolean flags and how they map to settings
    const BOOLEAN_FLAG_MAPPINGS = {
        "physicsDebugDraw": (val) => { Settings.PHYSICS_DEBUG_MODE = val; },
        "devMode": (val) => { Settings.DEVELOPMENT_MODE = val; },
        "sound": (val) => { Settings.SOUND = val; }
    };
    // Parses query string into key-value pairs
    function getUrlVars() {
        const vars = {};
        const href = window.location.href;
        href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_, key, value) => {
            vars[key] = decodeURIComponent(value.replace(/\+/g, ' '));
            return '';
        });
        return vars;
    }
    Settings.getUrlVars = getUrlVars;
    // Applies settings from URL query params
    function getSettingsFromUrl() {
        const argv = getUrlVars();
        // Handle boolean flags
        /*
        for (const [key, setValue] of Object.entries(BOOLEAN_FLAG_MAPPINGS)) {
            const rawValue = argv[key];
            if (rawValue !== undefined) {
                const boolValue = rawValue.toLowerCase() === 'true';
                setValue(boolValue);
            }
        }
        */
        // some of this 
        // view: https://chat.qwen.ai/s/6baed45c-fdbd-4291-a7c5-56e63fd9a823?fev=0.0.111
        for (const key in BOOLEAN_FLAG_MAPPINGS) {
            if (BOOLEAN_FLAG_MAPPINGS.hasOwnProperty(key)) {
                const setValue = BOOLEAN_FLAG_MAPPINGS[key];
                const rawValue = argv[key];
                if (rawValue !== undefined) {
                    const boolValue = rawValue.toLowerCase() === 'true';
                    setValue(boolValue);
                }
            }
        }
        // Special case: unitTest opens a test window
        if (argv["unitTest"] !== undefined) {
            const shouldRunTests = argv["unitTest"].toLowerCase() === 'true';
            if (shouldRunTests) {
                const testWindow = window.open('test.html', '|UnitTests', 'height=1000,width=700,top=100%');
                if (testWindow) {
                    testWindow.location.reload(); // Refresh existing window
                }
            }
        }
        // Log what was parsed
        _utils_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Notice: Settings parsed from URL:" + {
            physicsDebugDraw: argv["physicsDebugDraw"],
            devMode: argv["devMode"],
            unitTest: argv["unitTest"],
            sound: argv["sound"]
        });
    }
    Settings.getSettingsFromUrl = getSettingsFromUrl;
})(Settings || (Settings = {}));


/***/ }),

/***/ "./src/audio/Sound.ts":
/*!****************************!*\
  !*** ./src/audio/Sound.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sound: () => (/* binding */ Sound),
/* harmony export */   audioContext: () => (/* binding */ audioContext),
/* harmony export */   getAudioContext: () => (/* binding */ getAudioContext)
/* harmony export */ });
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Settings */ "./src/Settings.ts");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/logger */ "./src/utils/logger.ts");
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


const AudioContextImpl = window.AudioContext || webkitAudioContext;
let audioContext = null;
function getAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContextImpl();
    }
    return audioContext;
}
class Sound {
    constructor(buffer) {
        this.buffer = null;
        this.source = null;
        this.gainNode = null;
        this.playing = false;
        this.buffer = buffer;
        if (!this.buffer) {
            _utils_logger__WEBPACK_IMPORTED_MODULE_1__.Logger.error("buffer null");
        }
    }
    play(volume = 1, time = 0, allowSoundOverlay = false) {
        if (!_Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.SOUND || !this.buffer) {
            _utils_logger__WEBPACK_IMPORTED_MODULE_1__.Logger.debug("Sounds are currently disabled or buffer is missing.");
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
        if (_Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.SOUND && this.source) {
            this.source.stop();
            this.playing = false;
        }
    }
}


/***/ }),

/***/ "./src/environment/Maps.ts":
/*!*********************************!*\
  !*** ./src/environment/Maps.ts ***!
  \*********************************/
/***/ (() => {

throw new Error("Module parse failed: Shorthand property assignments are valid only in destructuring patterns (11:31)\nFile was processed with these loaders:\n * ./node_modules/ts-loader/index.js\nYou may need an additional loader to handle the result of these loaders.\n|         var aSpawnPoint;\n|         aSpawnPoint = Utils.pickUnique(this.mapDef.spawnPionts, \"spawnPoints\")\n>             == undefined ? { x = 42, y = 42 } : aSpawnPoint;\n|         if (!aSpawnPoint)\n|             aSpawnPoint.x = 42, y = 42;");

/***/ }),

/***/ "./src/gui/SettingsMenu.ts":
/*!*********************************!*\
  !*** ./src/gui/SettingsMenu.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsMenu: () => (/* binding */ SettingsMenu)
/* harmony export */ });
/* harmony import */ var _environment_Maps__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../environment/Maps */ "./src/environment/Maps.ts");
/* harmony import */ var _environment_Maps__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_environment_Maps__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _system_AssetManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../system/AssetManager */ "./src/system/AssetManager.ts");
/* harmony import */ var _system_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../system/Utils */ "./src/system/Utils.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Game */ "./src/Game.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Game__WEBPACK_IMPORTED_MODULE_3__);
// SettingsMenu.ts
 // Adjust path as needed



class SettingsMenu {
    constructor() {
        this.CSS_ID = {
            MAP_LIST_DIV: "#maps"
        };
        // Default selected map
        this.levelName = _environment_Maps__WEBPACK_IMPORTED_MODULE_0__.Maps.pirates.name;
        // Start building the view
        let mapsList = `
            <div id="mapSelector">
                <h1 style="text-align: center">Select a Map</h1>
                <div class="row-fluid" style="text-align: center">
                    <ul class="thumbnails">
        `;
        for (const mapKey in _environment_Maps__WEBPACK_IMPORTED_MODULE_0__.Maps) {
            if (Object.prototype.hasOwnProperty.call(_environment_Maps__WEBPACK_IMPORTED_MODULE_0__.Maps, mapKey)) {
                mapsList += this.addMapItem(_environment_Maps__WEBPACK_IMPORTED_MODULE_0__.Maps[mapKey], mapKey);
            }
        }
        mapsList += `
                    </ul>
                </div>
                <p style="text-align: center">
                    All map images were sourced from 
                    <a href="http://wmdb.org/" target="_blank">http://wmdb.org/</a>
                </p>
            </div>
        `;
        this.view = mapsList;
    }
    addMapItem(map, name) {
        const thumbnailTemplate = `
            <li class="span4" style="width:30%">
                <a href="#" class="thumbnail" id="{0}">
                    <img style="width: 160px; height: 80px;" src="{1}" />
                </a>
            </li>
        `;
        return (0,_system_Utils__WEBPACK_IMPORTED_MODULE_2__.formatString)(thumbnailTemplate, name, _system_AssetManager__WEBPACK_IMPORTED_MODULE_1__.AssetManager.getImage(map.smallImage).src);
    }
    bind(callback) {
        const _this = this;
        // Remove existing handlers to prevent duplicates
        $('a.thumbnail').off('click').on('click', function (e) {
            e.preventDefault();
            // Reset background color
            $('a.thumbnail').css("background", "white");
            // Highlight selected map
            $(this).css("background", "yellow");
            // Save selected level name
            const levelId = $(this).attr('id');
            if (levelId) {
                _this.levelName = levelId;
                _Game__WEBPACK_IMPORTED_MODULE_3__.Game.map = new Map(_environment_Maps__WEBPACK_IMPORTED_MODULE_0__.Maps[levelId]); // Assumes Map class exists
                callback();
            }
        });
    }
    getLevelName() {
        return this.levelName;
    }
    getView() {
        return this.view;
    }
}


/***/ }),

/***/ "./src/gui/StartMenu.ts":
/*!******************************!*\
  !*** ./src/gui/StartMenu.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StartMenu: () => (/* binding */ StartMenu)
/* harmony export */ });
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Settings */ "./src/Settings.ts");
/* harmony import */ var _system_Controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../system/Controls */ "./src/system/Controls.ts");
/* harmony import */ var _system_Controls__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_system_Controls__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _system_AssetManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../system/AssetManager */ "./src/system/AssetManager.ts");
/* harmony import */ var _utils_notify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/notify */ "./src/utils/notify.ts");
/* harmony import */ var _SettingsMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SettingsMenu */ "./src/gui/SettingsMenu.ts");
/* harmony import */ var _system_touchui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../system/touchui */ "./src/system/touchui.ts");
/**
 * StartMenu.js
 * This is the first menu the user interacts with
 * allows them to start the game and shows them the controls.
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
// StartMenu.ts



 // Assuming you have a Notify class/module

 // Optional: assuming this exists
/*
* we will make some change to not rely on an globaly available instance of Game e.g GameInstance
*/
class StartMenu {
    constructor(gameInstance) {
        this.settingsMenu = new _SettingsMenu__WEBPACK_IMPORTED_MODULE_4__.SettingsMenu;
        this.gameInstance = gameInstance;
        // Build controls view dynamically
        this.controlsView = ` 
            <div style="text-align:center">
                <p>
                    Just in case you've never played the original Worms Armageddon,
                    it's a turn-based deathmatch game where you control a team of worms.
                    Use whatever weapons you have to destroy the enemy.
                </p><br>
                <p>
                    <kbd>Space</kbd>
                    <kbd>${String.fromCharCode(_system_Controls__WEBPACK_IMPORTED_MODULE_1__.Controls.walkLeft.keyboard)}</kbd>
                    <kbd>${String.fromCharCode(_system_Controls__WEBPACK_IMPORTED_MODULE_1__.Controls.walkRight.keyboard)}</kbd>
                    - Jump, Left, Right.<br><br>
                    <kbd>${String.fromCharCode(_system_Controls__WEBPACK_IMPORTED_MODULE_1__.Controls.aimUp.keyboard)}</kbd>
                    <kbd>${String.fromCharCode(_system_Controls__WEBPACK_IMPORTED_MODULE_1__.Controls.aimDown.keyboard)}</kbd>
                    - Aim up and down.<br><br>
                    <kbd>${String.fromCharCode(_system_Controls__WEBPACK_IMPORTED_MODULE_1__.Controls.toggleWeaponMenu.keyboard)}</kbd> or right mouse - Weapon Menu.<br><br>
                    <kbd>Enter</kbd> - Fire weapon.
                </p><br>
                <a class="btn btn-primary btn-large" id="startLocal" style="text-align:center">Let's play!</a>
            </div>`;
    }
    hide() {
        $('#startMenu').remove();
    }
    onGameReady(callback) {
        StartMenu.callback = callback;
        if (!_Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.DEVELOPMENT_MODE) {
            const loading = setInterval(() => {
                $('#notice').empty();
                if (_system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.getPerAssetsLoaded() >= 100) {
                    clearInterval(loading);
                    this.settingsMenu = new _SettingsMenu__WEBPACK_IMPORTED_MODULE_4__.SettingsMenu();
                    $('#startLocal').removeAttr("disabled");
                    $('#startOnline').removeAttr("disabled");
                    // Browser warning logic
                    if ($.browser.msie) {
                        $('#startTutorial').removeAttr("disabled");
                        $('#notice').append(`
                            <div class="alert alert-error" style="text-align:center">
                                <strong>Bad news :(</strong> You're using Internet Explorer.
                                Performance will suffer. For best performance, use
                                <a href="https://www.google.com/intl/en/chrome/browser/">Chrome</a> 
                                or <a href="http://www.mozilla.org/en-US/firefox/new/">Firefox</a>.
                            </div>`);
                    }
                    else if (_system_touchui__WEBPACK_IMPORTED_MODULE_5__.TouchUI.isTouchDevice()) {
                        $('#notice').append(`
                            <div class="alert alert-warning" style="text-align:center">
                                <strong>Hey tablet user:</strong> There may be performance issues
                                and some missing features. But you can still play!
                            </div>`);
                    }
                    else {
                        $('#startTutorial').removeAttr("disabled");
                        $('#notice').append(`
                            <div class="alert alert-success" style="text-align:center">
                                <strong>Games loaded and you're ready to play!!</strong><br>
                                Thanks for using a modern browser.
                                <a href="#" id="awesome">You're awesome!</a>
                            </div>`);
                        $('#awesome').off('click').on('click', () => {
                            _utils_notify__WEBPACK_IMPORTED_MODULE_3__.Notify.display("Awesome!", "<img src='../data/images/awesome.jpg'/>", 5000);
                        });
                    }
                }
                else {
                    $('#notice').append(`
                        <div class="alert alert-info" style="text-align:center">
                            <strong>Stand back! I'm loading game assets!</strong>
                            <div class="progress progress-striped active">
                                <div class="bar" style="width: ${_system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.getPerAssetsLoaded()}%;"></div>
                            </div>
                        </div>`);
                }
            }, 500);
            $('#startLocal').off('click').on('click', () => {
                if (_system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.isReady()) {
                    _system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.getSound("CursorSelect").play();
                    $('.slide').empty();
                    $('.slide').append(this.settingsMenu.getView());
                    this.settingsMenu.bind(() => {
                        _system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.getSound("CursorSelect").play();
                        this.controlsMenu(callback);
                    });
                }
            });
            $('#startOnline').off('click').on('click', () => {
                if (_system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.isReady()) {
                    if (this.gameInstance.lobby.client_init() !== false) {
                        $('#notice').empty();
                        this.gameInstance.lobby.menu.show(callback);
                        _system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.getSound("CursorSelect").play();
                    }
                    else {
                        $('#notice').empty();
                        $('#notice').append(`
                            <div class="alert alert-error">
                                <strong>Oh dear!</strong> Looks like the multiplayer server is down.
                                Try a local game instead?
                            </div>`);
                    }
                }
            });
            $('#startTutorial').off('click').on('click', () => {
                if (_system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.isReady()) {
                    _system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.getSound("CursorSelect").play();
                    this.gameInstance.tutorial = new Tutorial(); // Assumes Tutorial class exists
                    this.controlsMenu(callback);
                }
            });
        }
        else {
            // Development Mode
            const loading = setInterval(() => {
                if (_system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.getPerAssetsLoaded() === 100) {
                    clearInterval(loading);
                    callback();
                }
            }, 2);
        }
    }
    controlsMenu(callback) {
        $('.slide').fadeOut('normal', () => {
            $('.slide').empty();
            $('.slide').append(this.controlsView).fadeIn('slow');
            $('#startLocal').off('click').on('click', () => {
                $('#startLocal').off('click');
                $('#splashScreen').remove();
                $('#startMenu').fadeOut('normal');
                _system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.getSound("CursorSelect").play();
                _system_AssetManager__WEBPACK_IMPORTED_MODULE_2__.AssetManager.getSound("StartRound").play(1, 0.5);
                callback();
            });
        });
    }
}


/***/ }),

/***/ "./src/system/AssetManager.ts":
/*!************************************!*\
  !*** ./src/system/AssetManager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssetManager: () => (/* binding */ AssetManager),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _audio_Sound__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../audio/Sound */ "./src/audio/Sound.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Settings */ "./src/Settings.ts");
/* harmony import */ var _environment_Maps__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../environment/Maps */ "./src/environment/Maps.ts");
/* harmony import */ var _environment_Maps__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_environment_Maps__WEBPACK_IMPORTED_MODULE_2__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const AssetManager = {
    images: {},
    sounds: {},
    numAssetsLoaded: 0,
    imagesToBeLoaded: [
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/images/menu/stick.png`
    ],
    audioToBeLoaded: [
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/CursorSelect.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/explosion1.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/explosion2.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/explosion3.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/WalkExpand.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/WalkCompress.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/drill.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/JUMP1.WAV`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/TIMERTICK.WAV`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/holygrenade.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/hurry.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/ohdear.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/fire.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/victory.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/ow1.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/ow2.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/ow3.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/byebye.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/traitor.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/youllregretthat.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/justyouwait.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/watchthis.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/fatality.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/laugh.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/incoming.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/grenade.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/Speech/Irish/yessir.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/cantclickhere.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/StartRound.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/JetPackLoop1.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/JetPackLoop2.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/fuse.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/fanfare/Ireland.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/NinjaRopeFire.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/NinjaRopeImpact.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/ROCKETPOWERUP.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/HOLYGRENADEIMPACT.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/GRENADEIMPACT.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/WormLanding.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/THROWPOWERUP.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/THROWRELEASE.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/SHOTGUNRELOAD.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/ShotGunFire.wav`,
        `${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/sounds/MiniGunFire.wav`
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
        return this.sounds[name] || new _audio_Sound__WEBPACK_IMPORTED_MODULE_0__.Sound(null);
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
                if (_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.BUILD_MANIFEST_FILE)
                    throw new Error("Using manifest");
                // Try Web Audio API first
                if (!_audio_Sound__WEBPACK_IMPORTED_MODULE_0__.Sound.context) {
                    _audio_Sound__WEBPACK_IMPORTED_MODULE_0__.Sound.context = new (window.AudioContext || window.webkitAudioContext)();
                }
                const bufferLoader = new BufferLoader(_audio_Sound__WEBPACK_IMPORTED_MODULE_0__.Sound.context, sources, (bufferList) => {
                    for (const buffer of bufferList) {
                        this.sounds[buffer.name] = new _audio_Sound__WEBPACK_IMPORTED_MODULE_0__.Sound(buffer.buffer);
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
                        this.sounds[name] = new (class SoundFallback extends _audio_Sound__WEBPACK_IMPORTED_MODULE_0__.Sound {
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
            this.imagesToBeLoaded.push(`${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}${path}${imageName}.png`);
        }
    },
    _addMapImagesToLoadList() {
        for (const mapKey in _environment_Maps__WEBPACK_IMPORTED_MODULE_2__.Maps) {
            const map = _environment_Maps__WEBPACK_IMPORTED_MODULE_2__.Maps[mapKey];
            this.imagesToBeLoaded.push(`${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/images/levels/${map.terrainImage}.png`);
            this.imagesToBeLoaded.push(`${_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.REMOTE_ASSERT_SERVER}data/images/levels/${map.smallImage}.png`);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AssetManager);


/***/ }),

/***/ "./src/system/Controls.ts":
/*!********************************!*\
  !*** ./src/system/Controls.ts ***!
  \********************************/
/***/ (() => {

throw new Error("Module parse failed: Shorthand property assignments are valid only in destructuring patterns (12:21)\nFile was processed with these loaders:\n * ./node_modules/ts-loader/index.js\nYou may need an additional loader to handle the result of these loaders.\n|         msPerFrame: 100,\n|     },\n>     toggleWeaponMenu = {\n|         gamepad: -1,\n|         keyboard: 101,");

/***/ }),

/***/ "./src/system/Graphics.ts":
/*!********************************!*\
  !*** ./src/system/Graphics.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Graphics: () => (/* binding */ Graphics)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'stats.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Settings */ "./src/Settings.ts");
/**
 * Graphics.js
 * Graphics namespace provides helper functions for creating a canvas
 * it also setup the request animation frame shim and the stats.js fps counter
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
//import { Stats } from 'stats.js'


class PreRenderer {
    createPreRenderCanvas(width, height) {
        const bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = width + 2;
        bufferCanvas.height = height + 2;
        const ctx = bufferCanvas.getContext("2d");
        if (!ctx)
            throw new Error("Could not get canvas context");
        ctx.translate(1, 1);
        return ctx;
    }
    render(drawFunc, width, height, canvas = null) {
        let ctx;
        if (canvas) {
            ctx = canvas.getContext('2d');
            if (!ctx)
                throw new Error("Could not get canvas context");
        }
        else {
            ctx = this.createPreRenderCanvas(width, height);
        }
        drawFunc(ctx);
        return ctx.canvas;
    }
    renderAnimation(drawFuncsCollection, width, height) {
        const ctx = this.createPreRenderCanvas(width, height * drawFuncsCollection.length);
        for (const drawFunc of drawFuncsCollection) {
            drawFunc.call(ctx, ctx);
            ctx.translate(0, height);
        }
        // Reset translation after rendering
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        return ctx.canvas;
    }
}
// === Graphics Module - Converted to ES6-style exports ===
var Graphics;
(function (Graphics) {
    Graphics.preRenderer = new PreRenderer();
    function init() {
        if (_Settings__WEBPACK_IMPORTED_MODULE_1__.Settings.DEVELOPMENT_MODE) {
            Graphics.stats = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'stats.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())();
            Graphics.stats.domElement.style.position = 'absolute';
            Graphics.stats.domElement.style.left = '0px';
            Graphics.stats.domElement.style.top = '0px';
            document.body.appendChild(Graphics.stats.domElement);
        }
        window.requestAnimationFrame = (() => {
            return (window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                    return 1;
                });
        })();
    }
    Graphics.init = init;
    function roundRect(ctx, x, y, w, h, r) {
        if (w < 2 * r)
            r = w / 2;
        if (h < 2 * r)
            r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        return ctx;
    }
    Graphics.roundRect = roundRect;
    function createCanvas(name) {
        const canvas = document.createElement('canvas');
        canvas.id = name;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
        document.body.appendChild(canvas);
        $('body').on('contextmenu', "#" + name, function (e) {
            e.preventDefault();
            return false;
        });
        return canvas;
    }
    Graphics.createCanvas = createCanvas;
})(Graphics || (Graphics = {}));


/***/ }),

/***/ "./src/system/Utils.ts":
/*!*****************************!*\
  !*** ./src/system/Utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Utils: () => (/* binding */ Utils),
/* harmony export */   formatString: () => (/* binding */ formatString)
/* harmony export */ });
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/logger */ "./src/utils/logger.ts");
/* harmony import */ var _AssetManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AssetManager */ "./src/system/AssetManager.ts");


/*
interface String
{
    format(...numbers: String[]);
}
String.prototype.format = function (...numbers: String[])
{
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number)
    {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
            ;
    });
};

*/
// Need some refactoring 2. String.format replacement as a utility function
function formatString(template, ...args) {
    return template.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== "undefined" ? args[number] : match;
    });
}
var Utils;
(function (Utils) {
    //Allows for the copying of Object types into their proper types, used for copy constructer
    //for objects that are sent over the network. I have intergrated this function, into
    // the constructor of the Person object so it acts like C-style copy construction
    // WARNING: This creates a deep copy, so reference are not preserved
    /*export function copy(newObject, oldObject)
    {

        for (var member in oldObject)
        {
            // if the member is itself an object, then we most also call copy on that
            if (typeof (oldObject[member]) == "object")
            {
                //FIXME : Should be usig this try catch, fix it later
                try
                {
                    newObject[member] = copy(newObject[member], oldObject[member])
                } catch (e)
                {

                }
            } else
            {
                // if its a primative member just assign it
                try
                {
                    newObject[member] = oldObject[member];
                } catch (e)
                {

                }
            }
        }

        return newObject;
    };*/
    /**
    * Recursively copies all properties from source to target.
    * Mutates the target object.
    */
    function isDate(value) {
        return value instanceof Date;
    }
    /**
    * @function copy copies all properties from source to target.
    * Mutates the target object.
    */
    function copy(target, source) {
        for (const key in source) {
            if (!Object.prototype.hasOwnProperty.call(source, key))
                continue;
            const value = source[key];
            if (value === null || value === undefined) {
                target[key] = value;
                continue;
            }
            // Handle Date
            if (isDate(value)) {
                target[key] = new Date(value);
                continue;
            }
            // Handle Array
            if (Array.isArray(value)) {
                target[key] = [].concat(value.map((item) => (typeof item === "object" ? copy({}, item) : item)));
                continue;
            }
            // Handle Object
            if (typeof value === "object") {
                if (!(key in target) || typeof target[key] !== "object" || target[key] === null) {
                    target[key] = {};
                }
                copy(target[key], value);
                continue;
            }
            // Primitive values
            target[key] = value;
        }
        return target;
    }
    Utils.copy = copy;
    function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }
    Utils.sign = sign;
    /*
    export function findByValue(needle, haystack, haystackProperity, )
    {

        for (var i = 0; i < haystack.length; i++)
        {
            if (haystack[i][haystackProperity] === needle)
            {
                return haystack[i];
            }
        }
        throw "Couldn't find object with proerpty " + haystackProperity + " equal to " + needle;
    }
    *
    **
    * Finds an object in an array by comparing a specific property value.
    * @throws Error if no match is found
    */
    function findByValue(needle, haystack, haystackProperty) {
        const result = haystack.find(item => item[haystackProperty] === needle);
        if (!result) {
            throw new Error(`Couldn't find object with property "${String(haystackProperty)}" equal to ${String(needle)}`);
        }
        return result;
    }
    Utils.findByValue = findByValue;
    //added types
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    Utils.random = random;
    /*
    export function pickRandom(collection)
    {
        return collection[random(0, collection.length - 1)];
    }
    */
    /**
     * Returns a random element from the given array.
     * Returns undefined if array is empty.
     */
    function pickRandom(array) {
        if (array.length === 0)
            return undefined;
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }
    Utils.pickRandom = pickRandom;
    /**
     * replace the below
     *
    var pickUniqueCollection = [];
    export function pickUnqine(collection, stringId: string) {
        if (pickUniqueCollection[stringId]) {
            var items = pickUniqueCollection[stringId];

            if (items.length <= 0) {
                Logger.error("Out of unqine items in collection " + stringId);
                return;
            }

            var index = random(0, items.length - 1)
            var unqineItem = items[index];
            deleteFromCollection(items, index);
            return unqineItem;

        } else {
            pickUniqueCollection[stringId] = collection;
            return pickUnqine(collection, stringId);
        }
    }
    */
    // Assuming T is the type of elements in the collection
    const pickUniqueCollection = {};
    function pickUnique(collection, stringId) {
        let items = pickUniqueCollection[stringId];
        if (!items) {
            // First time: store the collection
            pickUniqueCollection[stringId] = [...collection]; // copy to avoid mutating original
            items = pickUniqueCollection[stringId];
        }
        if (items.length <= 0) {
            _utils_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Out of unique items in collection: " + stringId);
            return undefined;
        }
        const index = Math.floor(Math.random() * items.length);
        const item = items[index];
        // Remove item at index
        items.splice(index, 1);
        return item;
    }
    Utils.pickUnique = pickUnique;
    function pickRandomSound(collection) {
        var sound = _AssetManager__WEBPACK_IMPORTED_MODULE_1__.AssetManager.getSound(collection[random(0, collection.length - 1)]);
        if (!sound.play) {
            _utils_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.warn(" Somthing looks dogoy with the sound object " + sound);
        }
        return sound;
    }
    Utils.pickRandomSound = pickRandomSound;
    /**
     *
     * need refacto
        export function deleteFromCollection(collection, indexToRemove) {
            delete collection[indexToRemove];
            collection.splice(indexToRemove, 1);
        }
     *
     /
    /** Removes an item at the specified index from the array. */
    function deleteFromCollection(collection, indexToRemove) {
        if (indexToRemove >= 0 && indexToRemove < collection.length) {
            collection.splice(indexToRemove, 1);
        }
    }
    Utils.deleteFromCollection = deleteFromCollection;
    /** Checks if a value is between min and max (inclusive). */
    function isBetweenRange(value, min, max) {
        return value >= min && value <= max;
    }
    Utils.isBetweenRange = isBetweenRange;
    /** Converts an angle in radians to a 2D vector. */
    function angleToVector(angle) {
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }
    Utils.angleToVector = angleToVector;
    /** Converts a 2D vector to an angle in radians. */
    function vectorToAngle(vector) {
        return Math.atan2(vector.y, vector.x);
    }
    Utils.vectorToAngle = vectorToAngle;
    /** Converts degrees to radians. */
    function toRadians(angleInDegrees) {
        return angleInDegrees * (Math.PI / 180);
    }
    Utils.toRadians = toRadians;
    /** Converts radians to degrees. */
    function toDegrees(angleInRadians) {
        return angleInRadians * (180 / Math.PI);
    }
    Utils.toDegrees = toDegrees;
    function compress(s) {
        const dict = { CharacterData: 255 }; // initial special token
        const data = s.split("");
        const out = [];
        let phrase = data[0];
        let code = 256;
        for (let i = 1; i < data.length; i++) {
            const currChar = data[i];
            if (dict[phrase + currChar] !== undefined) {
                phrase += currChar;
            }
            else {
                // Push char code if single character, otherwise dictionary value
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        // Convert numbers to characters
        const compressed = out.map(c => String.fromCharCode(c)).join("");
        return compressed;
    }
    Utils.compress = compress;
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    Utils.isNumber = isNumber;
})(Utils || (Utils = {}));
/**
 *
 * @comment
    module Notify
    {
        export var locked = false;
        export var levels = {
            sucess: "alert-success",
            warn: "alert-warn",
    ...
    }
    move to notify.ts

/*
module Logger
{

    export function log(message)
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
            console.info(message);
    }

    export function warn(message)
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
         console.warn(message);
    }

    export function debug(message)
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG )
            console.log(message);
    }

    export function error(message)
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
            console.error(message);
    }
}
*/
/**
moved
module TouchUI
{
..
}
to touchui.ts
*/
/**
 * moved
  module keyboard;
  to keyboard.ts
  */ 


/***/ }),

/***/ "./src/system/touchui.ts":
/*!*******************************!*\
  !*** ./src/system/touchui.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TouchUI: () => (/* binding */ TouchUI)
/* harmony export */ });
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/logger */ "./src/utils/logger.ts");
/**
 * @namespace MathUtils
 * @description Utility functions for common mathematical operations.
 * @author enoola
 * @version 0.0.1
 */
//extracted from Settings.ts

var TouchUI;
(function (TouchUI) {
    var isFireHeld = false;
    var isJumpPressed = false;
    function isTouchDevice() {
        //orig. return 'ontouchstart' in window || navigator.msMaxTouchPoints;
        //it doesn't exists anymore
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    }
    TouchUI.isTouchDevice = isTouchDevice;
    ;
    function init() {
        if (TouchUI.isTouchDevice()) {
            var fireButtonCssId = "touchFireButton";
            var jumpButtonCssId = "touchJump";
            //Using this to also insert the touch controls for tablets
            $('body').append("<div class=touchButton id=" + fireButtonCssId + ">Fire</div>");
            $('body').append("<div class=touchButton id=" + jumpButtonCssId + ">Jump</div>");
            $("#" + fireButtonCssId).bind('touchstart', function (e) {
                e.preventDefault();
                isFireHeld = true;
                _utils_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log("touchstarted");
            });
            $("#" + fireButtonCssId).bind("touchend", function (e) {
                isFireHeld = false;
                _utils_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log("touchend");
            });
            $("#" + jumpButtonCssId).bind('touchstart', function (e) {
                e.preventDefault();
                isJumpPressed = true;
            });
            $("#" + jumpButtonCssId).bind("touchend", function (e) {
                isJumpPressed = false;
            });
        }
    }
    TouchUI.init = init;
    function isFireButtonDown(reset = false) {
        if (isFireHeld && reset) {
            isFireHeld = false;
            return true;
        }
        return isFireHeld;
    }
    TouchUI.isFireButtonDown = isFireButtonDown;
    function isJumpDown(reset = false) {
        if (isJumpPressed && reset) {
            isJumpPressed = false;
            return true;
        }
        return isJumpPressed;
    }
    TouchUI.isJumpDown = isJumpDown;
})(TouchUI || (TouchUI = {}));


/***/ }),

/***/ "./src/utils/logger.ts":
/*!*****************************!*\
  !*** ./src/utils/logger.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Logger: () => (/* binding */ Logger)
/* harmony export */ });
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Settings */ "./src/Settings.ts");

/**
 * @namespace Logger
 * @description Utility functions picked from utils.ts file and refactored with qwen
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */
const Logger = {
    log(message) {
        if (_Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.DEVELOPMENT_MODE || _Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.LOG)
            console.info(message);
    },
    warn(message) {
        if (_Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.DEVELOPMENT_MODE || _Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.LOG)
            console.warn(message);
    },
    debug(message) {
        if (_Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.DEVELOPMENT_MODE || _Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.LOG)
            console.log(message);
    },
    error(message) {
        if (_Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.DEVELOPMENT_MODE || _Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.LOG)
            console.error(message);
    }
};


/***/ }),

/***/ "./src/utils/notify.ts":
/*!*****************************!*\
  !*** ./src/utils/notify.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Notify: () => (/* binding */ Notify)
/* harmony export */ });
/**
 * @namespace Logger
 * @description Utility functions picked from utils.ts file
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */
var Notify;
(function (Notify) {
    Notify.locked = false;
    Notify.levels = {
        sucess: "alert-success",
        warn: "alert-warn",
        error: "alert-error"
    };
    function display(header, message, autoHideTime = 2800, cssStyle = Notify.levels.sucess, doNotOverWrite = false) {
        if (!Notify.locked) {
            Notify.locked = doNotOverWrite;
            $("#notifaction").removeClass(Notify.levels.warn);
            $("#notifaction").removeClass(Notify.levels.error);
            $("#notifaction").removeClass(Notify.levels.sucess);
            $("#notifaction").addClass(cssStyle);
            $("#notifaction strong").empty();
            $("#notifaction strong").html(header);
            $("#notifaction p").empty();
            $("#notifaction p").html(message);
            $("#notifaction").animate({
                top: (parseInt($("#notifaction").css("height"))) + "px"
            }, 400, function () {
                if (autoHideTime > 0) {
                    setTimeout(hide, autoHideTime);
                }
            });
        }
    }
    Notify.display = display;
    /*
    export function hide(callback)
    {
        if (!locked)
        {
            $("#notifaction").animate({
                top: (-parseInt($("#notifaction").css("height"))) - 100 + "px"
            }, 400, function () => {
                locked = false;
                if (callback: any != null)
                {
                    callback();
                }
            });
        }
    }
    */
    function hide(callback) {
        const $notification = $("#notification");
        if (!Notify.locked) {
            const height = parseInt($notification.css("height"), 10);
            Notify.locked = true;
            $notification.animate({ top: -height - 100 + "px" }, 400, () => {
                Notify.locked = false;
                if (callback) {
                    callback();
                }
            });
        }
    }
    Notify.hide = hide;
})(Notify || (Notify = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settings */ "./src/Settings.ts");
/* harmony import */ var _system_Graphics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./system/Graphics */ "./src/system/Graphics.ts");
/* harmony import */ var _gui_StartMenu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gui/StartMenu */ "./src/gui/StartMenu.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Game */ "./src/Game.ts");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Game__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _system_AssetManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./system/AssetManager */ "./src/system/AssetManager.ts");
// main.ts





let GameInstance;
$(document).ready(() => {
    _Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.getSettingsFromUrl();
    if (!_Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.RUN_UNIT_TEST_ONLY) {
        GameInstance = new _Game__WEBPACK_IMPORTED_MODULE_3__.Game();
        const startMenu = new _gui_StartMenu__WEBPACK_IMPORTED_MODULE_2__.StartMenu(GameInstance);
        _system_AssetManager__WEBPACK_IMPORTED_MODULE_4__["default"].loadAssets();
        startMenu.onGameReady(() => {
            startMenu.hide();
            if (!GameInstance.state.isStarted) {
                GameInstance.start();
            }
            function gameloop() {
                var _a;
                if (_Settings__WEBPACK_IMPORTED_MODULE_0__.Settings.DEVELOPMENT_MODE) {
                    (_a = _system_Graphics__WEBPACK_IMPORTED_MODULE_1__.Graphics.stats) === null || _a === void 0 ? void 0 : _a.update(); // Optional chaining in case stats is null
                }
                GameInstance.step();
                GameInstance.update();
                GameInstance.draw();
                window.requestAnimationFrame(gameloop);
            }
            gameloop();
        });
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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c0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekMsV0FBVywrQ0FBUSxzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxpREFBaUQ7QUFDakQsS0FBSztBQUNMO0FBQ0Esd0NBQXdDLCtDQUFLO0FBQzdDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELElBQUk7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxL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O1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNzQztBQUNPO0FBQ0Q7QUFDZDtBQUNtQjtBQUNqRDtBQUNBO0FBQ0EsSUFBSSwrQ0FBUTtBQUNaLFNBQVMsK0NBQVE7QUFDakIsMkJBQTJCLHVDQUFJO0FBQy9CLDhCQUE4QixxREFBUztBQUN2QyxRQUFRLDREQUFZO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLCtDQUFRO0FBQzVCLDBCQUEwQixzREFBUSwwREFBMEQ7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd29ybXMtcmVmYWN0b3IvLi9zcmMvU2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vd29ybXMtcmVmYWN0b3IvLi9zcmMvYXVkaW8vU291bmQudHMiLCJ3ZWJwYWNrOi8vd29ybXMtcmVmYWN0b3IvLi9zcmMvZ3VpL1NldHRpbmdzTWVudS50cyIsIndlYnBhY2s6Ly93b3Jtcy1yZWZhY3Rvci8uL3NyYy9ndWkvU3RhcnRNZW51LnRzIiwid2VicGFjazovL3dvcm1zLXJlZmFjdG9yLy4vc3JjL3N5c3RlbS9Bc3NldE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vd29ybXMtcmVmYWN0b3IvLi9zcmMvc3lzdGVtL0dyYXBoaWNzLnRzIiwid2VicGFjazovL3dvcm1zLXJlZmFjdG9yLy4vc3JjL3N5c3RlbS9VdGlscy50cyIsIndlYnBhY2s6Ly93b3Jtcy1yZWZhY3Rvci8uL3NyYy9zeXN0ZW0vdG91Y2h1aS50cyIsIndlYnBhY2s6Ly93b3Jtcy1yZWZhY3Rvci8uL3NyYy91dGlscy9sb2dnZXIudHMiLCJ3ZWJwYWNrOi8vd29ybXMtcmVmYWN0b3IvLi9zcmMvdXRpbHMvbm90aWZ5LnRzIiwid2VicGFjazovL3dvcm1zLXJlZmFjdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dvcm1zLXJlZmFjdG9yL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dvcm1zLXJlZmFjdG9yL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93b3Jtcy1yZWZhY3Rvci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dvcm1zLXJlZmFjdG9yL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd29ybXMtcmVmYWN0b3IvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAgR2xvYmFsIHNldHRpbmdzIGZvciB0aGUgd2hvbGUgZ2FtZVxuICpcbiAqICBMaWNlbnNlOiBBcGFjaGUgMi4wXG4gKiAgYXV0aG9yOiAgQ2lhcu+/vW4gTWNDYW5uXG4gKiAgdXJsOiBodHRwOi8vd3d3LmNpYXJhbm1jY2Fubi5tZS9cbiAqL1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vdXRpbHMvbG9nZ2VyXCI7XG4vL2ltcG9ydCB7IFV0aWxzIH0gZnJvbSBcInN5c3RlbS9VdGlsc1wiXG4vL2ltcG9ydCB7IExvZ2dlciB9IGZyb20gXCJ1dGlscy9Mb2dnZXJcIjtcbi8vIGR1cmluZyB2YXIgZGVjbGFyYXRpb24gZS5nOiBcImV4cG9ydCB2YXIgTkFNRU9GVkFSXCIgSSBtYWlubHkgcmVwbGFjZWQgXG4vLyB3aXRoIEV4cG9ydGVkIG11dGFibGUgc2V0dGluZ3MgZS5nOiBcImV4cG9ydCBsZXQgTkFNRU9GVkFSXCJcbmV4cG9ydCB2YXIgU2V0dGluZ3M7XG4oZnVuY3Rpb24gKFNldHRpbmdzKSB7XG4gICAgLy9HYW1lIHZhcnNcbiAgICBTZXR0aW5ncy5QTEFZRVJfVFVSTl9USU1FID0gNDUgKiAxMDAwOyAvLyA2MCBzZWNvdW5kc1xuICAgIFNldHRpbmdzLlRVUk5fVElNRV9XQVJJTkcgPSA1OyAvLyBhZnRlciAxMCBzZWNvdW5kcyB3YXJuIHBsYXllciB0aGV5IGFyZSBydW5uaW5nIG91dCBvZiB0aW1lXG4gICAgLy9HZW5lcmFsIGdhbWUgc2V0dGluZ3NcbiAgICBTZXR0aW5ncy5TT1VORCA9IGZhbHNlO1xuICAgIC8vU2VydmVyIGRldGFpbHNcbiAgICBTZXR0aW5ncy5OT0RFX1NFUlZFUl9JUCA9ICc5Ni4xMjYuMTExLjIxMSc7XG4gICAgU2V0dGluZ3MuTEVBREVSQk9BUkRfQVBJX1VSTCA9ICdodHRwOi8vOTYuMTI2LjExMS4yMTEnO1xuICAgIFNldHRpbmdzLk5PREVfU0VSVkVSX1BPUlQgPSAnODA4MCc7XG4gICAgLy8gZGV2ZWxvcG1lbnQgdmFyc1xuICAgIFNldHRpbmdzLkRFVkVMT1BNRU5UX01PREUgPSBmYWxzZTtcbiAgICBTZXR0aW5ncy5MT0cgPSB0cnVlO1xuICAgIC8vV2hlbiBJIHdhbnQgdG8gYnVpbGQgdGhlIG1hbmlmZXN0IGZpbGUgdXNpbmcgXG4gICAgLy8gaHR0cDovL3dlc3RjaXYuY29tL3Rvb2xzL21hbmlmZXN0Ui9cbiAgICBTZXR0aW5ncy5CVUlMRF9NQU5JRkVTVF9GSUxFID0gZmFsc2U7XG4gICAgU2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVIgPSBcIi4uL1wiOyAvL1wiLi4vY29sbGVnZS9meXAvXCJcbiAgICBTZXR0aW5ncy5BUElfS0VZID0gXCJBSXphU3lBMWFaaGNJaFJRMmdibXl4VjV0OXBHSzQ3aEdzaUlPN1VcIjtcbiAgICBTZXR0aW5ncy5QSFlTSUNTX0RFQlVHX01PREUgPSBmYWxzZTtcbiAgICBTZXR0aW5ncy5SVU5fVU5JVF9URVNUX09OTFkgPSAhdHJ1ZTtcbiAgICBTZXR0aW5ncy5ORVRXT1JLRURfR0FNRV9RVUFMSVRZX0xFVkVMUyA9IHtcbiAgICAgICAgSElHSDogMCxcbiAgICAgICAgTUVESVVNOiAxLFxuICAgICAgICBMT1c6IDJcbiAgICB9O1xuICAgIFNldHRpbmdzLk5FVFdPUktFRF9HQU1FX1FVQUxJVFkgPSBTZXR0aW5ncy5ORVRXT1JLRURfR0FNRV9RVUFMSVRZX0xFVkVMUy5ISUdIO1xuICAgIC8vIEV4cG9ydGVkIG11dGFibGUgc2V0dGluZ3NcbiAgICAvLyBEZWZpbmUga25vd24gYm9vbGVhbiBmbGFncyBhbmQgaG93IHRoZXkgbWFwIHRvIHNldHRpbmdzXG4gICAgY29uc3QgQk9PTEVBTl9GTEFHX01BUFBJTkdTID0ge1xuICAgICAgICBcInBoeXNpY3NEZWJ1Z0RyYXdcIjogKHZhbCkgPT4geyBTZXR0aW5ncy5QSFlTSUNTX0RFQlVHX01PREUgPSB2YWw7IH0sXG4gICAgICAgIFwiZGV2TW9kZVwiOiAodmFsKSA9PiB7IFNldHRpbmdzLkRFVkVMT1BNRU5UX01PREUgPSB2YWw7IH0sXG4gICAgICAgIFwic291bmRcIjogKHZhbCkgPT4geyBTZXR0aW5ncy5TT1VORCA9IHZhbDsgfVxuICAgIH07XG4gICAgLy8gUGFyc2VzIHF1ZXJ5IHN0cmluZyBpbnRvIGtleS12YWx1ZSBwYWlyc1xuICAgIGZ1bmN0aW9uIGdldFVybFZhcnMoKSB7XG4gICAgICAgIGNvbnN0IHZhcnMgPSB7fTtcbiAgICAgICAgY29uc3QgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICBocmVmLnJlcGxhY2UoL1s/Jl0rKFtePSZdKyk9KFteJl0qKS9naSwgKF8sIGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIHZhcnNba2V5XSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZS5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFycztcbiAgICB9XG4gICAgU2V0dGluZ3MuZ2V0VXJsVmFycyA9IGdldFVybFZhcnM7XG4gICAgLy8gQXBwbGllcyBzZXR0aW5ncyBmcm9tIFVSTCBxdWVyeSBwYXJhbXNcbiAgICBmdW5jdGlvbiBnZXRTZXR0aW5nc0Zyb21VcmwoKSB7XG4gICAgICAgIGNvbnN0IGFyZ3YgPSBnZXRVcmxWYXJzKCk7XG4gICAgICAgIC8vIEhhbmRsZSBib29sZWFuIGZsYWdzXG4gICAgICAgIC8qXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgc2V0VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKEJPT0xFQU5fRkxBR19NQVBQSU5HUykpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhd1ZhbHVlID0gYXJndltrZXldO1xuICAgICAgICAgICAgaWYgKHJhd1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBib29sVmFsdWUgPSByYXdWYWx1ZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG4gICAgICAgICAgICAgICAgc2V0VmFsdWUoYm9vbFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICAvLyBzb21lIG9mIHRoaXMgXG4gICAgICAgIC8vIHZpZXc6IGh0dHBzOi8vY2hhdC5xd2VuLmFpL3MvNmJhZWQ0NWMtZmRiZC00MjkxLWE3YzUtNTZlNjNmZDlhODIzP2Zldj0wLjAuMTExXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIEJPT0xFQU5fRkxBR19NQVBQSU5HUykge1xuICAgICAgICAgICAgaWYgKEJPT0xFQU5fRkxBR19NQVBQSU5HUy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0VmFsdWUgPSBCT09MRUFOX0ZMQUdfTUFQUElOR1Nba2V5XTtcbiAgICAgICAgICAgICAgICBjb25zdCByYXdWYWx1ZSA9IGFyZ3Zba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAocmF3VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBib29sVmFsdWUgPSByYXdWYWx1ZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG4gICAgICAgICAgICAgICAgICAgIHNldFZhbHVlKGJvb2xWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFNwZWNpYWwgY2FzZTogdW5pdFRlc3Qgb3BlbnMgYSB0ZXN0IHdpbmRvd1xuICAgICAgICBpZiAoYXJndltcInVuaXRUZXN0XCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZFJ1blRlc3RzID0gYXJndltcInVuaXRUZXN0XCJdLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJztcbiAgICAgICAgICAgIGlmIChzaG91bGRSdW5UZXN0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RXaW5kb3cgPSB3aW5kb3cub3BlbigndGVzdC5odG1sJywgJ3xVbml0VGVzdHMnLCAnaGVpZ2h0PTEwMDAsd2lkdGg9NzAwLHRvcD0xMDAlJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRlc3RXaW5kb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVzdFdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTsgLy8gUmVmcmVzaCBleGlzdGluZyB3aW5kb3dcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gTG9nIHdoYXQgd2FzIHBhcnNlZFxuICAgICAgICBMb2dnZXIubG9nKFwiTm90aWNlOiBTZXR0aW5ncyBwYXJzZWQgZnJvbSBVUkw6XCIgKyB7XG4gICAgICAgICAgICBwaHlzaWNzRGVidWdEcmF3OiBhcmd2W1wicGh5c2ljc0RlYnVnRHJhd1wiXSxcbiAgICAgICAgICAgIGRldk1vZGU6IGFyZ3ZbXCJkZXZNb2RlXCJdLFxuICAgICAgICAgICAgdW5pdFRlc3Q6IGFyZ3ZbXCJ1bml0VGVzdFwiXSxcbiAgICAgICAgICAgIHNvdW5kOiBhcmd2W1wic291bmRcIl1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFNldHRpbmdzLmdldFNldHRpbmdzRnJvbVVybCA9IGdldFNldHRpbmdzRnJvbVVybDtcbn0pKFNldHRpbmdzIHx8IChTZXR0aW5ncyA9IHt9KSk7XG4iLCIvKipcbiAqIFNvdW5kLmpzXG4gKiBTb3VuZCB3cmFwcyB0aGUgV2ViIGF1ZGlvIGFwaS4gV2hlbiBhIHNvdW5kIGZpbGUgaXMgbG9hZGVkXG4gKiBvbmUgb2YgdGhlc2UgaXMgY3JlYXRlZCB1c2luZyB0aGUgc291bmQgYnVmZmVyLiBJdCBhbGxvd3MgZm9yIGFcbiAqIGNsZWFuZXIgYW5kIHNpbXBsZSBhcGkgZm9yIGRvaW5nIGJhc2ljIHRoaW5ncyBsaWtlIHBsYXlpbmcgc291bmQsIGNvbnRyb2xpbmcgdm9sdW1lIGV0Y1xuICpcbiAqIFNvdW5kRmFsbGJhY2sgdXNlIGp1c3QgdGhlIHNpbXBsZSBBdWRpbyB0YWcsIHdvcmtzIG9rIGJ1dCBub3QgYXMgZmVhdHVyZSBmdWxsIGFzIHdlYiBhdWRpbyBhcGkuXG4gKlxuICogIExpY2Vuc2U6IEFwYWNoZSAyLjBcbiAqICBhdXRob3I6ICBDaWFyw6FuIE1jQ2FublxuICogIHVybDogaHR0cDovL3d3dy5jaWFyYW5tY2Nhbm4ubWUvXG4gKi9cbi8qKlxuICogT2xkIGltcG9ydCAvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9zeXN0ZW0vVXRpbHMudHNcIi8+XG4gKi9cbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL1NldHRpbmdzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi4vdXRpbHMvbG9nZ2VyXCI7XG5jb25zdCBBdWRpb0NvbnRleHRJbXBsID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3ZWJraXRBdWRpb0NvbnRleHQ7XG5leHBvcnQgbGV0IGF1ZGlvQ29udGV4dCA9IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gZ2V0QXVkaW9Db250ZXh0KCkge1xuICAgIGlmICghYXVkaW9Db250ZXh0KSB7XG4gICAgICAgIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHRJbXBsKCk7XG4gICAgfVxuICAgIHJldHVybiBhdWRpb0NvbnRleHQ7XG59XG5leHBvcnQgY2xhc3MgU291bmQge1xuICAgIGNvbnN0cnVjdG9yKGJ1ZmZlcikge1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuc291cmNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5nYWluTm9kZSA9IG51bGw7XG4gICAgICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgICAgaWYgKCF0aGlzLmJ1ZmZlcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiYnVmZmVyIG51bGxcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGxheSh2b2x1bWUgPSAxLCB0aW1lID0gMCwgYWxsb3dTb3VuZE92ZXJsYXkgPSBmYWxzZSkge1xuICAgICAgICBpZiAoIVNldHRpbmdzLlNPVU5EIHx8ICF0aGlzLmJ1ZmZlcikge1xuICAgICAgICAgICAgTG9nZ2VyLmRlYnVnKFwiU291bmRzIGFyZSBjdXJyZW50bHkgZGlzYWJsZWQgb3IgYnVmZmVyIGlzIG1pc3NpbmcuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5wbGF5aW5nIHx8IGFsbG93U291bmRPdmVybGF5KSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IGdldEF1ZGlvQ29udGV4dCgpLmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UuYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgICAgICAgICB0aGlzLmdhaW5Ob2RlID0gZ2V0QXVkaW9Db250ZXh0KCkuY3JlYXRlR2FpbigpO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UuY29ubmVjdCh0aGlzLmdhaW5Ob2RlKTtcbiAgICAgICAgICAgIHRoaXMuZ2Fpbk5vZGUuY29ubmVjdChnZXRBdWRpb0NvbnRleHQoKS5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB0aGlzLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSB2b2x1bWU7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZS5zdGFydCh0aW1lKTtcbiAgICAgICAgICAgIHRoaXMucGxheWluZyA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuYnVmZmVyLmR1cmF0aW9uO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9LCBkdXJhdGlvbiAqIDEwMDApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlzUGxheWluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGxheWluZztcbiAgICB9XG4gICAgcGF1c2UoKSB7XG4gICAgICAgIGlmIChTZXR0aW5ncy5TT1VORCAmJiB0aGlzLnNvdXJjZSkge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2Uuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBTZXR0aW5nc01lbnUudHNcbmltcG9ydCB7IE1hcHMgfSBmcm9tIFwiLi4vZW52aXJvbm1lbnQvTWFwc1wiOyAvLyBBZGp1c3QgcGF0aCBhcyBuZWVkZWRcbmltcG9ydCB7IEFzc2V0TWFuYWdlciB9IGZyb20gXCIuLi9zeXN0ZW0vQXNzZXRNYW5hZ2VyXCI7XG5pbXBvcnQgeyBmb3JtYXRTdHJpbmcgfSBmcm9tIFwiLi4vc3lzdGVtL1V0aWxzXCI7XG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uL0dhbWVcIjtcbmV4cG9ydCBjbGFzcyBTZXR0aW5nc01lbnUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkNTU19JRCA9IHtcbiAgICAgICAgICAgIE1BUF9MSVNUX0RJVjogXCIjbWFwc1wiXG4gICAgICAgIH07XG4gICAgICAgIC8vIERlZmF1bHQgc2VsZWN0ZWQgbWFwXG4gICAgICAgIHRoaXMubGV2ZWxOYW1lID0gTWFwcy5waXJhdGVzLm5hbWU7XG4gICAgICAgIC8vIFN0YXJ0IGJ1aWxkaW5nIHRoZSB2aWV3XG4gICAgICAgIGxldCBtYXBzTGlzdCA9IGBcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJtYXBTZWxlY3RvclwiPlxuICAgICAgICAgICAgICAgIDxoMSBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPlNlbGVjdCBhIE1hcDwvaDE+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdy1mbHVpZFwiIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cInRodW1ibmFpbHNcIj5cbiAgICAgICAgYDtcbiAgICAgICAgZm9yIChjb25zdCBtYXBLZXkgaW4gTWFwcykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChNYXBzLCBtYXBLZXkpKSB7XG4gICAgICAgICAgICAgICAgbWFwc0xpc3QgKz0gdGhpcy5hZGRNYXBJdGVtKE1hcHNbbWFwS2V5XSwgbWFwS2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtYXBzTGlzdCArPSBgXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgQWxsIG1hcCBpbWFnZXMgd2VyZSBzb3VyY2VkIGZyb20gXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8vd21kYi5vcmcvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cDovL3dtZGIub3JnLzwvYT5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgdGhpcy52aWV3ID0gbWFwc0xpc3Q7XG4gICAgfVxuICAgIGFkZE1hcEl0ZW0obWFwLCBuYW1lKSB7XG4gICAgICAgIGNvbnN0IHRodW1ibmFpbFRlbXBsYXRlID0gYFxuICAgICAgICAgICAgPGxpIGNsYXNzPVwic3BhbjRcIiBzdHlsZT1cIndpZHRoOjMwJVwiPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJ0aHVtYm5haWxcIiBpZD1cInswfVwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHN0eWxlPVwid2lkdGg6IDE2MHB4OyBoZWlnaHQ6IDgwcHg7XCIgc3JjPVwiezF9XCIgLz5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICBgO1xuICAgICAgICByZXR1cm4gZm9ybWF0U3RyaW5nKHRodW1ibmFpbFRlbXBsYXRlLCBuYW1lLCBBc3NldE1hbmFnZXIuZ2V0SW1hZ2UobWFwLnNtYWxsSW1hZ2UpLnNyYyk7XG4gICAgfVxuICAgIGJpbmQoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBSZW1vdmUgZXhpc3RpbmcgaGFuZGxlcnMgdG8gcHJldmVudCBkdXBsaWNhdGVzXG4gICAgICAgICQoJ2EudGh1bWJuYWlsJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAvLyBSZXNldCBiYWNrZ3JvdW5kIGNvbG9yXG4gICAgICAgICAgICAkKCdhLnRodW1ibmFpbCcpLmNzcyhcImJhY2tncm91bmRcIiwgXCJ3aGl0ZVwiKTtcbiAgICAgICAgICAgIC8vIEhpZ2hsaWdodCBzZWxlY3RlZCBtYXBcbiAgICAgICAgICAgICQodGhpcykuY3NzKFwiYmFja2dyb3VuZFwiLCBcInllbGxvd1wiKTtcbiAgICAgICAgICAgIC8vIFNhdmUgc2VsZWN0ZWQgbGV2ZWwgbmFtZVxuICAgICAgICAgICAgY29uc3QgbGV2ZWxJZCA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgICAgICAgIGlmIChsZXZlbElkKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubGV2ZWxOYW1lID0gbGV2ZWxJZDtcbiAgICAgICAgICAgICAgICBHYW1lLm1hcCA9IG5ldyBNYXAoTWFwc1tsZXZlbElkXSk7IC8vIEFzc3VtZXMgTWFwIGNsYXNzIGV4aXN0c1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXRMZXZlbE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxldmVsTmFtZTtcbiAgICB9XG4gICAgZ2V0VmlldygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmlldztcbiAgICB9XG59XG4iLCIvKipcbiAqIFN0YXJ0TWVudS5qc1xuICogVGhpcyBpcyB0aGUgZmlyc3QgbWVudSB0aGUgdXNlciBpbnRlcmFjdHMgd2l0aFxuICogYWxsb3dzIHRoZW0gdG8gc3RhcnQgdGhlIGdhbWUgYW5kIHNob3dzIHRoZW0gdGhlIGNvbnRyb2xzLlxuICpcbiAqICBMaWNlbnNlOiBBcGFjaGUgMi4wXG4gKiAgYXV0aG9yOiAgQ2lhcu+/vW4gTWNDYW5uXG4gKiAgdXJsOiBodHRwOi8vd3d3LmNpYXJhbm1jY2Fubi5tZS9cbiAqL1xuLy8gU3RhcnRNZW51LnRzXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi9TZXR0aW5nc1wiO1xuaW1wb3J0IHsgQ29udHJvbHMgfSBmcm9tIFwiLi4vc3lzdGVtL0NvbnRyb2xzXCI7XG5pbXBvcnQgeyBBc3NldE1hbmFnZXIgfSBmcm9tIFwiLi4vc3lzdGVtL0Fzc2V0TWFuYWdlclwiO1xuaW1wb3J0IHsgTm90aWZ5IH0gZnJvbSBcIi4uL3V0aWxzL25vdGlmeVwiOyAvLyBBc3N1bWluZyB5b3UgaGF2ZSBhIE5vdGlmeSBjbGFzcy9tb2R1bGVcbmltcG9ydCB7IFNldHRpbmdzTWVudSB9IGZyb20gXCIuL1NldHRpbmdzTWVudVwiO1xuaW1wb3J0IHsgVG91Y2hVSSB9IGZyb20gXCIuLi9zeXN0ZW0vdG91Y2h1aVwiOyAvLyBPcHRpb25hbDogYXNzdW1pbmcgdGhpcyBleGlzdHNcbi8qXG4qIHdlIHdpbGwgbWFrZSBzb21lIGNoYW5nZSB0byBub3QgcmVseSBvbiBhbiBnbG9iYWx5IGF2YWlsYWJsZSBpbnN0YW5jZSBvZiBHYW1lIGUuZyBHYW1lSW5zdGFuY2VcbiovXG5leHBvcnQgY2xhc3MgU3RhcnRNZW51IHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lSW5zdGFuY2UpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc01lbnUgPSBuZXcgU2V0dGluZ3NNZW51O1xuICAgICAgICB0aGlzLmdhbWVJbnN0YW5jZSA9IGdhbWVJbnN0YW5jZTtcbiAgICAgICAgLy8gQnVpbGQgY29udHJvbHMgdmlldyBkeW5hbWljYWxseVxuICAgICAgICB0aGlzLmNvbnRyb2xzVmlldyA9IGAgXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXJcIj5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgICAgSnVzdCBpbiBjYXNlIHlvdSd2ZSBuZXZlciBwbGF5ZWQgdGhlIG9yaWdpbmFsIFdvcm1zIEFybWFnZWRkb24sXG4gICAgICAgICAgICAgICAgICAgIGl0J3MgYSB0dXJuLWJhc2VkIGRlYXRobWF0Y2ggZ2FtZSB3aGVyZSB5b3UgY29udHJvbCBhIHRlYW0gb2Ygd29ybXMuXG4gICAgICAgICAgICAgICAgICAgIFVzZSB3aGF0ZXZlciB3ZWFwb25zIHlvdSBoYXZlIHRvIGRlc3Ryb3kgdGhlIGVuZW15LlxuICAgICAgICAgICAgICAgIDwvcD48YnI+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgIDxrYmQ+U3BhY2U8L2tiZD5cbiAgICAgICAgICAgICAgICAgICAgPGtiZD4ke1N0cmluZy5mcm9tQ2hhckNvZGUoQ29udHJvbHMud2Fsa0xlZnQua2V5Ym9hcmQpfTwva2JkPlxuICAgICAgICAgICAgICAgICAgICA8a2JkPiR7U3RyaW5nLmZyb21DaGFyQ29kZShDb250cm9scy53YWxrUmlnaHQua2V5Ym9hcmQpfTwva2JkPlxuICAgICAgICAgICAgICAgICAgICAtIEp1bXAsIExlZnQsIFJpZ2h0Ljxicj48YnI+XG4gICAgICAgICAgICAgICAgICAgIDxrYmQ+JHtTdHJpbmcuZnJvbUNoYXJDb2RlKENvbnRyb2xzLmFpbVVwLmtleWJvYXJkKX08L2tiZD5cbiAgICAgICAgICAgICAgICAgICAgPGtiZD4ke1N0cmluZy5mcm9tQ2hhckNvZGUoQ29udHJvbHMuYWltRG93bi5rZXlib2FyZCl9PC9rYmQ+XG4gICAgICAgICAgICAgICAgICAgIC0gQWltIHVwIGFuZCBkb3duLjxicj48YnI+XG4gICAgICAgICAgICAgICAgICAgIDxrYmQ+JHtTdHJpbmcuZnJvbUNoYXJDb2RlKENvbnRyb2xzLnRvZ2dsZVdlYXBvbk1lbnUua2V5Ym9hcmQpfTwva2JkPiBvciByaWdodCBtb3VzZSAtIFdlYXBvbiBNZW51Ljxicj48YnI+XG4gICAgICAgICAgICAgICAgICAgIDxrYmQ+RW50ZXI8L2tiZD4gLSBGaXJlIHdlYXBvbi5cbiAgICAgICAgICAgICAgICA8L3A+PGJyPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1sYXJnZVwiIGlkPVwic3RhcnRMb2NhbFwiIHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXJcIj5MZXQncyBwbGF5ITwvYT5cbiAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgfVxuICAgIGhpZGUoKSB7XG4gICAgICAgICQoJyNzdGFydE1lbnUnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgb25HYW1lUmVhZHkoY2FsbGJhY2spIHtcbiAgICAgICAgU3RhcnRNZW51LmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICghU2V0dGluZ3MuREVWRUxPUE1FTlRfTU9ERSkge1xuICAgICAgICAgICAgY29uc3QgbG9hZGluZyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKCcjbm90aWNlJykuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICBpZiAoQXNzZXRNYW5hZ2VyLmdldFBlckFzc2V0c0xvYWRlZCgpID49IDEwMCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzTWVudSA9IG5ldyBTZXR0aW5nc01lbnUoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3N0YXJ0TG9jYWwnKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNzdGFydE9ubGluZScpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQnJvd3NlciB3YXJuaW5nIGxvZ2ljXG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmJyb3dzZXIubXNpZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3N0YXJ0VHV0b3JpYWwnKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbm90aWNlJykuYXBwZW5kKGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZXJyb3JcIiBzdHlsZT1cInRleHQtYWxpZ246Y2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+QmFkIG5ld3MgOig8L3N0cm9uZz4gWW91J3JlIHVzaW5nIEludGVybmV0IEV4cGxvcmVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQZXJmb3JtYW5jZSB3aWxsIHN1ZmZlci4gRm9yIGJlc3QgcGVyZm9ybWFuY2UsIHVzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9pbnRsL2VuL2Nocm9tZS9icm93c2VyL1wiPkNocm9tZTwvYT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm1vemlsbGEub3JnL2VuLVVTL2ZpcmVmb3gvbmV3L1wiPkZpcmVmb3g8L2E+LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKFRvdWNoVUkuaXNUb3VjaERldmljZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbm90aWNlJykuYXBwZW5kKGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtd2FybmluZ1wiIHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5IZXkgdGFibGV0IHVzZXI6PC9zdHJvbmc+IFRoZXJlIG1heSBiZSBwZXJmb3JtYW5jZSBpc3N1ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIHNvbWUgbWlzc2luZyBmZWF0dXJlcy4gQnV0IHlvdSBjYW4gc3RpbGwgcGxheSFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzdGFydFR1dG9yaWFsJykucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI25vdGljZScpLmFwcGVuZChgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LXN1Y2Nlc3NcIiBzdHlsZT1cInRleHQtYWxpZ246Y2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+R2FtZXMgbG9hZGVkIGFuZCB5b3UncmUgcmVhZHkgdG8gcGxheSEhPC9zdHJvbmc+PGJyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGFua3MgZm9yIHVzaW5nIGEgbW9kZXJuIGJyb3dzZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgaWQ9XCJhd2Vzb21lXCI+WW91J3JlIGF3ZXNvbWUhPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2F3ZXNvbWUnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmeS5kaXNwbGF5KFwiQXdlc29tZSFcIiwgXCI8aW1nIHNyYz0nLi4vZGF0YS9pbWFnZXMvYXdlc29tZS5qcGcnLz5cIiwgNTAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI25vdGljZScpLmFwcGVuZChgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtaW5mb1wiIHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPlN0YW5kIGJhY2shIEknbSBsb2FkaW5nIGdhbWUgYXNzZXRzITwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBwcm9ncmVzcy1zdHJpcGVkIGFjdGl2ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmFyXCIgc3R5bGU9XCJ3aWR0aDogJHtBc3NldE1hbmFnZXIuZ2V0UGVyQXNzZXRzTG9hZGVkKCl9JTtcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICAkKCcjc3RhcnRMb2NhbCcpLm9mZignY2xpY2snKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKEFzc2V0TWFuYWdlci5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgQXNzZXRNYW5hZ2VyLmdldFNvdW5kKFwiQ3Vyc29yU2VsZWN0XCIpLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNsaWRlJykuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNsaWRlJykuYXBwZW5kKHRoaXMuc2V0dGluZ3NNZW51LmdldFZpZXcoKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3NNZW51LmJpbmQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgQXNzZXRNYW5hZ2VyLmdldFNvdW5kKFwiQ3Vyc29yU2VsZWN0XCIpLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHNNZW51KGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjc3RhcnRPbmxpbmUnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChBc3NldE1hbmFnZXIuaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWVJbnN0YW5jZS5sb2JieS5jbGllbnRfaW5pdCgpICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI25vdGljZScpLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVJbnN0YW5jZS5sb2JieS5tZW51LnNob3coY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgQXNzZXRNYW5hZ2VyLmdldFNvdW5kKFwiQ3Vyc29yU2VsZWN0XCIpLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNub3RpY2UnKS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI25vdGljZScpLmFwcGVuZChgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWVycm9yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+T2ggZGVhciE8L3N0cm9uZz4gTG9va3MgbGlrZSB0aGUgbXVsdGlwbGF5ZXIgc2VydmVyIGlzIGRvd24uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRyeSBhIGxvY2FsIGdhbWUgaW5zdGVhZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI3N0YXJ0VHV0b3JpYWwnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChBc3NldE1hbmFnZXIuaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIEFzc2V0TWFuYWdlci5nZXRTb3VuZChcIkN1cnNvclNlbGVjdFwiKS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUluc3RhbmNlLnR1dG9yaWFsID0gbmV3IFR1dG9yaWFsKCk7IC8vIEFzc3VtZXMgVHV0b3JpYWwgY2xhc3MgZXhpc3RzXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHNNZW51KGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIERldmVsb3BtZW50IE1vZGVcbiAgICAgICAgICAgIGNvbnN0IGxvYWRpbmcgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKEFzc2V0TWFuYWdlci5nZXRQZXJBc3NldHNMb2FkZWQoKSA9PT0gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29udHJvbHNNZW51KGNhbGxiYWNrKSB7XG4gICAgICAgICQoJy5zbGlkZScpLmZhZGVPdXQoJ25vcm1hbCcsICgpID0+IHtcbiAgICAgICAgICAgICQoJy5zbGlkZScpLmVtcHR5KCk7XG4gICAgICAgICAgICAkKCcuc2xpZGUnKS5hcHBlbmQodGhpcy5jb250cm9sc1ZpZXcpLmZhZGVJbignc2xvdycpO1xuICAgICAgICAgICAgJCgnI3N0YXJ0TG9jYWwnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoJyNzdGFydExvY2FsJykub2ZmKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICQoJyNzcGxhc2hTY3JlZW4nKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAkKCcjc3RhcnRNZW51JykuZmFkZU91dCgnbm9ybWFsJyk7XG4gICAgICAgICAgICAgICAgQXNzZXRNYW5hZ2VyLmdldFNvdW5kKFwiQ3Vyc29yU2VsZWN0XCIpLnBsYXkoKTtcbiAgICAgICAgICAgICAgICBBc3NldE1hbmFnZXIuZ2V0U291bmQoXCJTdGFydFJvdW5kXCIpLnBsYXkoMSwgMC41KTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgU291bmQgfSBmcm9tIFwiLi4vYXVkaW8vU291bmRcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL1NldHRpbmdzXCI7XG5pbXBvcnQgeyBNYXBzIH0gZnJvbSBcIi4uL2Vudmlyb25tZW50L01hcHNcIjtcbmV4cG9ydCBjb25zdCBBc3NldE1hbmFnZXIgPSB7XG4gICAgaW1hZ2VzOiB7fSxcbiAgICBzb3VuZHM6IHt9LFxuICAgIG51bUFzc2V0c0xvYWRlZDogMCxcbiAgICBpbWFnZXNUb0JlTG9hZGVkOiBbXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvaW1hZ2VzL21lbnUvc3RpY2sucG5nYFxuICAgIF0sXG4gICAgYXVkaW9Ub0JlTG9hZGVkOiBbXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL0N1cnNvclNlbGVjdC53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9leHBsb3Npb24xLndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL2V4cGxvc2lvbjIud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvZXhwbG9zaW9uMy53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9XYWxrRXhwYW5kLndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL1dhbGtDb21wcmVzcy53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9kcmlsbC53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9KVU1QMS5XQVZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9USU1FUlRJQ0suV0FWYCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvaG9seWdyZW5hZGUud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvU3BlZWNoL0lyaXNoL2h1cnJ5LndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL1NwZWVjaC9JcmlzaC9vaGRlYXIud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvU3BlZWNoL0lyaXNoL2ZpcmUud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvU3BlZWNoL0lyaXNoL3ZpY3Rvcnkud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvU3BlZWNoL0lyaXNoL293MS53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9TcGVlY2gvSXJpc2gvb3cyLndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL1NwZWVjaC9JcmlzaC9vdzMud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvU3BlZWNoL0lyaXNoL2J5ZWJ5ZS53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9TcGVlY2gvSXJpc2gvdHJhaXRvci53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9TcGVlY2gvSXJpc2gveW91bGxyZWdyZXR0aGF0LndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL1NwZWVjaC9JcmlzaC9qdXN0eW91d2FpdC53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9TcGVlY2gvSXJpc2gvd2F0Y2h0aGlzLndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL1NwZWVjaC9JcmlzaC9mYXRhbGl0eS53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9TcGVlY2gvSXJpc2gvbGF1Z2gud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvU3BlZWNoL0lyaXNoL2luY29taW5nLndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL1NwZWVjaC9JcmlzaC9ncmVuYWRlLndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL1NwZWVjaC9JcmlzaC95ZXNzaXIud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvY2FudGNsaWNraGVyZS53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9TdGFydFJvdW5kLndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL0pldFBhY2tMb29wMS53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9KZXRQYWNrTG9vcDIud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvZnVzZS53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9mYW5mYXJlL0lyZWxhbmQud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvTmluamFSb3BlRmlyZS53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9OaW5qYVJvcGVJbXBhY3Qud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvUk9DS0VUUE9XRVJVUC53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9IT0xZR1JFTkFERUlNUEFDVC53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9HUkVOQURFSU1QQUNULndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL1dvcm1MYW5kaW5nLndhdmAsXG4gICAgICAgIGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvc291bmRzL1RIUk9XUE9XRVJVUC53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9USFJPV1JFTEVBU0Uud2F2YCxcbiAgICAgICAgYCR7U2V0dGluZ3MuUkVNT1RFX0FTU0VSVF9TRVJWRVJ9ZGF0YS9zb3VuZHMvU0hPVEdVTlJFTE9BRC53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9TaG90R3VuRmlyZS53YXZgLFxuICAgICAgICBgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL3NvdW5kcy9NaW5pR3VuRmlyZS53YXZgXG4gICAgXSxcbiAgICBpc1JlYWR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5udW1Bc3NldHNMb2FkZWQgPj0gdGhpcy5pbWFnZXNUb0JlTG9hZGVkLmxlbmd0aCArIHRoaXMuYXVkaW9Ub0JlTG9hZGVkLmxlbmd0aDtcbiAgICB9LFxuICAgIGdldFBlckFzc2V0c0xvYWRlZCgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLm51bUFzc2V0c0xvYWRlZCAvICh0aGlzLmltYWdlc1RvQmVMb2FkZWQubGVuZ3RoICsgdGhpcy5hdWRpb1RvQmVMb2FkZWQubGVuZ3RoKSkgKiAxMDA7XG4gICAgfSxcbiAgICBnZXRJbWFnZShuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlc1tuYW1lXSB8fCBuZXcgSW1hZ2UoKTsgLy8gZmFsbGJhY2sgZm9yIG1pc3NpbmcgaW1hZ2VcbiAgICB9LFxuICAgIGdldFNvdW5kKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291bmRzW25hbWVdIHx8IG5ldyBTb3VuZChudWxsKTtcbiAgICB9LFxuICAgIGxvYWRJbWFnZXMoc291cmNlcykge1xuICAgICAgICBsZXQgbG9hZGVkSW1hZ2VzID0gMDtcbiAgICAgICAgY29uc3QgdG90YWxJbWFnZXMgPSBzb3VyY2VzLmxlbmd0aDtcbiAgICAgICAgZm9yIChjb25zdCBzcmMgb2Ygc291cmNlcykge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMuX2V4dHJhY3ROYW1lKHNyYyk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaW1hZ2VzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICAgICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlc1tuYW1lXSA9IGltZztcbiAgICAgICAgICAgICAgICAgICAgbG9hZGVkSW1hZ2VzKys7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubnVtQXNzZXRzTG9hZGVkKys7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2FkZWRJbWFnZXMgPT09IHRvdGFsSW1hZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFsbCBpbWFnZXMgbG9hZGVkIHN1Y2Nlc3NmdWxseVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaW1nLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBsb2FkIGltYWdlOiAke3NyY31gKTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGVkSW1hZ2VzKys7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubnVtQXNzZXRzTG9hZGVkKys7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW1hZ2UgXCIke25hbWV9XCIgYWxyZWFkeSBsb2FkZWRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgbG9hZFNvdW5kcyhzb3VyY2VzKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChTZXR0aW5ncy5CVUlMRF9NQU5JRkVTVF9GSUxFKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2luZyBtYW5pZmVzdFwiKTtcbiAgICAgICAgICAgICAgICAvLyBUcnkgV2ViIEF1ZGlvIEFQSSBmaXJzdFxuICAgICAgICAgICAgICAgIGlmICghU291bmQuY29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBTb3VuZC5jb250ZXh0ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlckxvYWRlciA9IG5ldyBCdWZmZXJMb2FkZXIoU291bmQuY29udGV4dCwgc291cmNlcywgKGJ1ZmZlckxpc3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBidWZmZXIgb2YgYnVmZmVyTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VuZHNbYnVmZmVyLm5hbWVdID0gbmV3IFNvdW5kKGJ1ZmZlci5idWZmZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5udW1Bc3NldHNMb2FkZWQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJ1ZmZlckxvYWRlci5sb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldlYiBBdWRpbyBBUEkgbm90IHN1cHBvcnRlZCwgZmFsbGluZyBiYWNrIHRvIEhUTUw1IEF1ZGlvXCIpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc3JjIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLl9leHRyYWN0TmFtZShzcmMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VuZHNbbmFtZV0gPSBuZXcgKGNsYXNzIFNvdW5kRmFsbGJhY2sgZXh0ZW5kcyBTb3VuZCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3Ioc3JjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyKHNyYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3JjID0gc3JjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KShzcmMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5udW1Bc3NldHNMb2FkZWQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgSFRNTDUgYXVkaW8uIFNvcnJ5IVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5udW1Bc3NldHNMb2FkZWQgKz0gc291cmNlcy5sZW5ndGg7IC8vIHNraXAgd2FpdGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBhZGRTcHJpdGVzRGVmVG9Mb2FkTGlzdCgpIHtcbiAgICAgICAgdGhpcy5fYWRkU3ByaXRlR3JvdXBUb0xvYWRMaXN0KFNwcml0ZXMud29ybXMsIFwiZGF0YS9pbWFnZXMvXCIpO1xuICAgICAgICB0aGlzLl9hZGRTcHJpdGVHcm91cFRvTG9hZExpc3QoU3ByaXRlcy53ZWFwb25JY29ucywgXCJkYXRhL2ltYWdlcy93ZWFwb25pY29ucy9cIik7XG4gICAgICAgIHRoaXMuX2FkZFNwcml0ZUdyb3VwVG9Mb2FkTGlzdChTcHJpdGVzLndlYXBvbnMsIFwiZGF0YS9pbWFnZXMvXCIpO1xuICAgICAgICB0aGlzLl9hZGRTcHJpdGVHcm91cFRvTG9hZExpc3QoU3ByaXRlcy5wYXJ0aWNsZUVmZmVjdHMsIFwiZGF0YS9pbWFnZXMvXCIpO1xuICAgICAgICB0aGlzLl9hZGRNYXBJbWFnZXNUb0xvYWRMaXN0KCk7XG4gICAgfSxcbiAgICBfYWRkU3ByaXRlR3JvdXBUb0xvYWRMaXN0KHNwcml0ZUdyb3VwLCBwYXRoKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHNwcml0ZUdyb3VwKSB7XG4gICAgICAgICAgICBjb25zdCBzcHJpdGUgPSBzcHJpdGVHcm91cFtrZXldO1xuICAgICAgICAgICAgY29uc3QgaW1hZ2VOYW1lID0gc3ByaXRlLmltYWdlTmFtZTtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzVG9CZUxvYWRlZC5wdXNoKGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfSR7cGF0aH0ke2ltYWdlTmFtZX0ucG5nYCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIF9hZGRNYXBJbWFnZXNUb0xvYWRMaXN0KCkge1xuICAgICAgICBmb3IgKGNvbnN0IG1hcEtleSBpbiBNYXBzKSB7XG4gICAgICAgICAgICBjb25zdCBtYXAgPSBNYXBzW21hcEtleV07XG4gICAgICAgICAgICB0aGlzLmltYWdlc1RvQmVMb2FkZWQucHVzaChgJHtTZXR0aW5ncy5SRU1PVEVfQVNTRVJUX1NFUlZFUn1kYXRhL2ltYWdlcy9sZXZlbHMvJHttYXAudGVycmFpbkltYWdlfS5wbmdgKTtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzVG9CZUxvYWRlZC5wdXNoKGAke1NldHRpbmdzLlJFTU9URV9BU1NFUlRfU0VSVkVSfWRhdGEvaW1hZ2VzL2xldmVscy8ke21hcC5zbWFsbEltYWdlfS5wbmdgKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgX2V4dHJhY3ROYW1lKHVybCkge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvKFthLXpBLVowLTlfLV0rKVxcLlxcdysvKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiB1cmw7XG4gICAgfVxufTtcbi8vIExvYWQgYWxsIGFzc2V0cyBvbiBpbml0XG5Bc3NldE1hbmFnZXIuYWRkU3ByaXRlc0RlZlRvTG9hZExpc3QoKTtcbkFzc2V0TWFuYWdlci5sb2FkSW1hZ2VzKEFzc2V0TWFuYWdlci5pbWFnZXNUb0JlTG9hZGVkKTtcbkFzc2V0TWFuYWdlci5sb2FkU291bmRzKEFzc2V0TWFuYWdlci5hdWRpb1RvQmVMb2FkZWQpO1xuZXhwb3J0IGRlZmF1bHQgQXNzZXRNYW5hZ2VyO1xuIiwiLyoqXG4gKiBHcmFwaGljcy5qc1xuICogR3JhcGhpY3MgbmFtZXNwYWNlIHByb3ZpZGVzIGhlbHBlciBmdW5jdGlvbnMgZm9yIGNyZWF0aW5nIGEgY2FudmFzXG4gKiBpdCBhbHNvIHNldHVwIHRoZSByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBzaGltIGFuZCB0aGUgc3RhdHMuanMgZnBzIGNvdW50ZXJcbiAqXG4gKiAgTGljZW5zZTogQXBhY2hlIDIuMFxuICogIGF1dGhvcjogIENpYXLvv71uIE1jQ2FublxuICogIHVybDogaHR0cDovL3d3dy5jaWFyYW5tY2Nhbm4ubWUvXG4gKi9cbi8vaW1wb3J0IHsgU3RhdHMgfSBmcm9tICdzdGF0cy5qcydcbmltcG9ydCB7IFN0YXRzIH0gZnJvbSAnc3RhdHMuanMnO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuLi9TZXR0aW5ncyc7XG5jbGFzcyBQcmVSZW5kZXJlciB7XG4gICAgY3JlYXRlUHJlUmVuZGVyQ2FudmFzKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgY29uc3QgYnVmZmVyQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGJ1ZmZlckNhbnZhcy53aWR0aCA9IHdpZHRoICsgMjtcbiAgICAgICAgYnVmZmVyQ2FudmFzLmhlaWdodCA9IGhlaWdodCArIDI7XG4gICAgICAgIGNvbnN0IGN0eCA9IGJ1ZmZlckNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGlmICghY3R4KVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGdldCBjYW52YXMgY29udGV4dFwiKTtcbiAgICAgICAgY3R4LnRyYW5zbGF0ZSgxLCAxKTtcbiAgICAgICAgcmV0dXJuIGN0eDtcbiAgICB9XG4gICAgcmVuZGVyKGRyYXdGdW5jLCB3aWR0aCwgaGVpZ2h0LCBjYW52YXMgPSBudWxsKSB7XG4gICAgICAgIGxldCBjdHg7XG4gICAgICAgIGlmIChjYW52YXMpIHtcbiAgICAgICAgICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgaWYgKCFjdHgpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGdldCBjYW52YXMgY29udGV4dFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGN0eCA9IHRoaXMuY3JlYXRlUHJlUmVuZGVyQ2FudmFzKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGRyYXdGdW5jKGN0eCk7XG4gICAgICAgIHJldHVybiBjdHguY2FudmFzO1xuICAgIH1cbiAgICByZW5kZXJBbmltYXRpb24oZHJhd0Z1bmNzQ29sbGVjdGlvbiwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBjb25zdCBjdHggPSB0aGlzLmNyZWF0ZVByZVJlbmRlckNhbnZhcyh3aWR0aCwgaGVpZ2h0ICogZHJhd0Z1bmNzQ29sbGVjdGlvbi5sZW5ndGgpO1xuICAgICAgICBmb3IgKGNvbnN0IGRyYXdGdW5jIG9mIGRyYXdGdW5jc0NvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGRyYXdGdW5jLmNhbGwoY3R4LCBjdHgpO1xuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlc2V0IHRyYW5zbGF0aW9uIGFmdGVyIHJlbmRlcmluZ1xuICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xuICAgICAgICByZXR1cm4gY3R4LmNhbnZhcztcbiAgICB9XG59XG4vLyA9PT0gR3JhcGhpY3MgTW9kdWxlIC0gQ29udmVydGVkIHRvIEVTNi1zdHlsZSBleHBvcnRzID09PVxuZXhwb3J0IHZhciBHcmFwaGljcztcbihmdW5jdGlvbiAoR3JhcGhpY3MpIHtcbiAgICBHcmFwaGljcy5wcmVSZW5kZXJlciA9IG5ldyBQcmVSZW5kZXJlcigpO1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIGlmIChTZXR0aW5ncy5ERVZFTE9QTUVOVF9NT0RFKSB7XG4gICAgICAgICAgICBHcmFwaGljcy5zdGF0cyA9IG5ldyBTdGF0cygpO1xuICAgICAgICAgICAgR3JhcGhpY3Muc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBHcmFwaGljcy5zdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgICAgICAgICAgIEdyYXBoaWNzLnN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKEdyYXBoaWNzLnN0YXRzLmRvbUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgfVxuICAgIEdyYXBoaWNzLmluaXQgPSBpbml0O1xuICAgIGZ1bmN0aW9uIHJvdW5kUmVjdChjdHgsIHgsIHksIHcsIGgsIHIpIHtcbiAgICAgICAgaWYgKHcgPCAyICogcilcbiAgICAgICAgICAgIHIgPSB3IC8gMjtcbiAgICAgICAgaWYgKGggPCAyICogcilcbiAgICAgICAgICAgIHIgPSBoIC8gMjtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKHggKyByLCB5KTtcbiAgICAgICAgY3R4LmFyY1RvKHggKyB3LCB5LCB4ICsgdywgeSArIGgsIHIpO1xuICAgICAgICBjdHguYXJjVG8oeCArIHcsIHkgKyBoLCB4LCB5ICsgaCwgcik7XG4gICAgICAgIGN0eC5hcmNUbyh4LCB5ICsgaCwgeCwgeSwgcik7XG4gICAgICAgIGN0eC5hcmNUbyh4LCB5LCB4ICsgdywgeSwgcik7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgcmV0dXJuIGN0eDtcbiAgICB9XG4gICAgR3JhcGhpY3Mucm91bmRSZWN0ID0gcm91bmRSZWN0O1xuICAgIGZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyhuYW1lKSB7XG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBjYW52YXMuaWQgPSBuYW1lO1xuICAgICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBjYW52YXMuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgIGNhbnZhcy5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICAgICQoJ2JvZHknKS5vbignY29udGV4dG1lbnUnLCBcIiNcIiArIG5hbWUsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2FudmFzO1xuICAgIH1cbiAgICBHcmFwaGljcy5jcmVhdGVDYW52YXMgPSBjcmVhdGVDYW52YXM7XG59KShHcmFwaGljcyB8fCAoR3JhcGhpY3MgPSB7fSkpO1xuIiwiaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL2xvZ2dlclwiO1xuaW1wb3J0IHsgQXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4vQXNzZXRNYW5hZ2VyXCI7XG4vKlxuaW50ZXJmYWNlIFN0cmluZ1xue1xuICAgIGZvcm1hdCguLi5udW1iZXJzOiBTdHJpbmdbXSk7XG59XG5TdHJpbmcucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICguLi5udW1iZXJzOiBTdHJpbmdbXSlcbntcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG51bWJlcilcbiAgICB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXG4gICAgICAgICAgPyBhcmdzW251bWJlcl1cbiAgICAgICAgICA6IG1hdGNoXG4gICAgICAgICAgICA7XG4gICAgfSk7XG59O1xuXG4qL1xuLy8gTmVlZCBzb21lIHJlZmFjdG9yaW5nIDIuIFN0cmluZy5mb3JtYXQgcmVwbGFjZW1lbnQgYXMgYSB1dGlsaXR5IGZ1bmN0aW9uXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0U3RyaW5nKHRlbXBsYXRlLCAuLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoL3soXFxkKyl9L2csIChtYXRjaCwgbnVtYmVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9PSBcInVuZGVmaW5lZFwiID8gYXJnc1tudW1iZXJdIDogbWF0Y2g7XG4gICAgfSk7XG59XG5leHBvcnQgdmFyIFV0aWxzO1xuKGZ1bmN0aW9uIChVdGlscykge1xuICAgIC8vQWxsb3dzIGZvciB0aGUgY29weWluZyBvZiBPYmplY3QgdHlwZXMgaW50byB0aGVpciBwcm9wZXIgdHlwZXMsIHVzZWQgZm9yIGNvcHkgY29uc3RydWN0ZXJcbiAgICAvL2ZvciBvYmplY3RzIHRoYXQgYXJlIHNlbnQgb3ZlciB0aGUgbmV0d29yay4gSSBoYXZlIGludGVyZ3JhdGVkIHRoaXMgZnVuY3Rpb24sIGludG9cbiAgICAvLyB0aGUgY29uc3RydWN0b3Igb2YgdGhlIFBlcnNvbiBvYmplY3Qgc28gaXQgYWN0cyBsaWtlIEMtc3R5bGUgY29weSBjb25zdHJ1Y3Rpb25cbiAgICAvLyBXQVJOSU5HOiBUaGlzIGNyZWF0ZXMgYSBkZWVwIGNvcHksIHNvIHJlZmVyZW5jZSBhcmUgbm90IHByZXNlcnZlZFxuICAgIC8qZXhwb3J0IGZ1bmN0aW9uIGNvcHkobmV3T2JqZWN0LCBvbGRPYmplY3QpXG4gICAge1xuXG4gICAgICAgIGZvciAodmFyIG1lbWJlciBpbiBvbGRPYmplY3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBtZW1iZXIgaXMgaXRzZWxmIGFuIG9iamVjdCwgdGhlbiB3ZSBtb3N0IGFsc28gY2FsbCBjb3B5IG9uIHRoYXRcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKG9sZE9iamVjdFttZW1iZXJdKSA9PSBcIm9iamVjdFwiKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vRklYTUUgOiBTaG91bGQgYmUgdXNpZyB0aGlzIHRyeSBjYXRjaCwgZml4IGl0IGxhdGVyXG4gICAgICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3RbbWVtYmVyXSA9IGNvcHkobmV3T2JqZWN0W21lbWJlcl0sIG9sZE9iamVjdFttZW1iZXJdKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpXG4gICAgICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gaWYgaXRzIGEgcHJpbWF0aXZlIG1lbWJlciBqdXN0IGFzc2lnbiBpdFxuICAgICAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0W21lbWJlcl0gPSBvbGRPYmplY3RbbWVtYmVyXTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKVxuICAgICAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdPYmplY3Q7XG4gICAgfTsqL1xuICAgIC8qKlxuICAgICogUmVjdXJzaXZlbHkgY29waWVzIGFsbCBwcm9wZXJ0aWVzIGZyb20gc291cmNlIHRvIHRhcmdldC5cbiAgICAqIE11dGF0ZXMgdGhlIHRhcmdldCBvYmplY3QuXG4gICAgKi9cbiAgICBmdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAZnVuY3Rpb24gY29weSBjb3BpZXMgYWxsIHByb3BlcnRpZXMgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0LlxuICAgICogTXV0YXRlcyB0aGUgdGFyZ2V0IG9iamVjdC5cbiAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcHkodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSGFuZGxlIERhdGVcbiAgICAgICAgICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBIYW5kbGUgQXJyYXlcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gW10uY29uY2F0KHZhbHVlLm1hcCgoaXRlbSkgPT4gKHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiID8gY29weSh7fSwgaXRlbSkgOiBpdGVtKSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSGFuZGxlIE9iamVjdFxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiB0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXRba2V5XSAhPT0gXCJvYmplY3RcIiB8fCB0YXJnZXRba2V5XSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb3B5KHRhcmdldFtrZXldLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQcmltaXRpdmUgdmFsdWVzXG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgIFV0aWxzLmNvcHkgPSBjb3B5O1xuICAgIGZ1bmN0aW9uIHNpZ24oeCkgeyByZXR1cm4geCA+IDAgPyAxIDogeCA8IDAgPyAtMSA6IDA7IH1cbiAgICBVdGlscy5zaWduID0gc2lnbjtcbiAgICAvKlxuICAgIGV4cG9ydCBmdW5jdGlvbiBmaW5kQnlWYWx1ZShuZWVkbGUsIGhheXN0YWNrLCBoYXlzdGFja1Byb3Blcml0eSwgKVxuICAgIHtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhheXN0YWNrLmxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoaGF5c3RhY2tbaV1baGF5c3RhY2tQcm9wZXJpdHldID09PSBuZWVkbGUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhheXN0YWNrW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93IFwiQ291bGRuJ3QgZmluZCBvYmplY3Qgd2l0aCBwcm9lcnB0eSBcIiArIGhheXN0YWNrUHJvcGVyaXR5ICsgXCIgZXF1YWwgdG8gXCIgKyBuZWVkbGU7XG4gICAgfVxuICAgICpcbiAgICAqKlxuICAgICogRmluZHMgYW4gb2JqZWN0IGluIGFuIGFycmF5IGJ5IGNvbXBhcmluZyBhIHNwZWNpZmljIHByb3BlcnR5IHZhbHVlLlxuICAgICogQHRocm93cyBFcnJvciBpZiBubyBtYXRjaCBpcyBmb3VuZFxuICAgICovXG4gICAgZnVuY3Rpb24gZmluZEJ5VmFsdWUobmVlZGxlLCBoYXlzdGFjaywgaGF5c3RhY2tQcm9wZXJ0eSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBoYXlzdGFjay5maW5kKGl0ZW0gPT4gaXRlbVtoYXlzdGFja1Byb3BlcnR5XSA9PT0gbmVlZGxlKTtcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGRuJ3QgZmluZCBvYmplY3Qgd2l0aCBwcm9wZXJ0eSBcIiR7U3RyaW5nKGhheXN0YWNrUHJvcGVydHkpfVwiIGVxdWFsIHRvICR7U3RyaW5nKG5lZWRsZSl9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgVXRpbHMuZmluZEJ5VmFsdWUgPSBmaW5kQnlWYWx1ZTtcbiAgICAvL2FkZGVkIHR5cGVzXG4gICAgZnVuY3Rpb24gcmFuZG9tKG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgIH1cbiAgICBVdGlscy5yYW5kb20gPSByYW5kb207XG4gICAgLypcbiAgICBleHBvcnQgZnVuY3Rpb24gcGlja1JhbmRvbShjb2xsZWN0aW9uKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25bcmFuZG9tKDAsIGNvbGxlY3Rpb24ubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICAqL1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSByYW5kb20gZWxlbWVudCBmcm9tIHRoZSBnaXZlbiBhcnJheS5cbiAgICAgKiBSZXR1cm5zIHVuZGVmaW5lZCBpZiBhcnJheSBpcyBlbXB0eS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwaWNrUmFuZG9tKGFycmF5KSB7XG4gICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFycmF5Lmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBhcnJheVtpbmRleF07XG4gICAgfVxuICAgIFV0aWxzLnBpY2tSYW5kb20gPSBwaWNrUmFuZG9tO1xuICAgIC8qKlxuICAgICAqIHJlcGxhY2UgdGhlIGJlbG93XG4gICAgICpcbiAgICB2YXIgcGlja1VuaXF1ZUNvbGxlY3Rpb24gPSBbXTtcbiAgICBleHBvcnQgZnVuY3Rpb24gcGlja1VucWluZShjb2xsZWN0aW9uLCBzdHJpbmdJZDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChwaWNrVW5pcXVlQ29sbGVjdGlvbltzdHJpbmdJZF0pIHtcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IHBpY2tVbmlxdWVDb2xsZWN0aW9uW3N0cmluZ0lkXTtcblxuICAgICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiT3V0IG9mIHVucWluZSBpdGVtcyBpbiBjb2xsZWN0aW9uIFwiICsgc3RyaW5nSWQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcmFuZG9tKDAsIGl0ZW1zLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICB2YXIgdW5xaW5lSXRlbSA9IGl0ZW1zW2luZGV4XTtcbiAgICAgICAgICAgIGRlbGV0ZUZyb21Db2xsZWN0aW9uKGl0ZW1zLCBpbmRleCk7XG4gICAgICAgICAgICByZXR1cm4gdW5xaW5lSXRlbTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGlja1VuaXF1ZUNvbGxlY3Rpb25bc3RyaW5nSWRdID0gY29sbGVjdGlvbjtcbiAgICAgICAgICAgIHJldHVybiBwaWNrVW5xaW5lKGNvbGxlY3Rpb24sIHN0cmluZ0lkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAqL1xuICAgIC8vIEFzc3VtaW5nIFQgaXMgdGhlIHR5cGUgb2YgZWxlbWVudHMgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICBjb25zdCBwaWNrVW5pcXVlQ29sbGVjdGlvbiA9IHt9O1xuICAgIGZ1bmN0aW9uIHBpY2tVbmlxdWUoY29sbGVjdGlvbiwgc3RyaW5nSWQpIHtcbiAgICAgICAgbGV0IGl0ZW1zID0gcGlja1VuaXF1ZUNvbGxlY3Rpb25bc3RyaW5nSWRdO1xuICAgICAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICAgICAgICAvLyBGaXJzdCB0aW1lOiBzdG9yZSB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICAgcGlja1VuaXF1ZUNvbGxlY3Rpb25bc3RyaW5nSWRdID0gWy4uLmNvbGxlY3Rpb25dOyAvLyBjb3B5IHRvIGF2b2lkIG11dGF0aW5nIG9yaWdpbmFsXG4gICAgICAgICAgICBpdGVtcyA9IHBpY2tVbmlxdWVDb2xsZWN0aW9uW3N0cmluZ0lkXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbXMubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIk91dCBvZiB1bmlxdWUgaXRlbXMgaW4gY29sbGVjdGlvbjogXCIgKyBzdHJpbmdJZCk7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaXRlbXMubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2luZGV4XTtcbiAgICAgICAgLy8gUmVtb3ZlIGl0ZW0gYXQgaW5kZXhcbiAgICAgICAgaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICAgIFV0aWxzLnBpY2tVbmlxdWUgPSBwaWNrVW5pcXVlO1xuICAgIGZ1bmN0aW9uIHBpY2tSYW5kb21Tb3VuZChjb2xsZWN0aW9uKSB7XG4gICAgICAgIHZhciBzb3VuZCA9IEFzc2V0TWFuYWdlci5nZXRTb3VuZChjb2xsZWN0aW9uW3JhbmRvbSgwLCBjb2xsZWN0aW9uLmxlbmd0aCAtIDEpXSk7XG4gICAgICAgIGlmICghc291bmQucGxheSkge1xuICAgICAgICAgICAgTG9nZ2VyLndhcm4oXCIgU29tdGhpbmcgbG9va3MgZG9nb3kgd2l0aCB0aGUgc291bmQgb2JqZWN0IFwiICsgc291bmQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzb3VuZDtcbiAgICB9XG4gICAgVXRpbHMucGlja1JhbmRvbVNvdW5kID0gcGlja1JhbmRvbVNvdW5kO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogbmVlZCByZWZhY3RvXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBkZWxldGVGcm9tQ29sbGVjdGlvbihjb2xsZWN0aW9uLCBpbmRleFRvUmVtb3ZlKSB7XG4gICAgICAgICAgICBkZWxldGUgY29sbGVjdGlvbltpbmRleFRvUmVtb3ZlXTtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24uc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xuICAgICAgICB9XG4gICAgICpcbiAgICAgL1xuICAgIC8qKiBSZW1vdmVzIGFuIGl0ZW0gYXQgdGhlIHNwZWNpZmllZCBpbmRleCBmcm9tIHRoZSBhcnJheS4gKi9cbiAgICBmdW5jdGlvbiBkZWxldGVGcm9tQ29sbGVjdGlvbihjb2xsZWN0aW9uLCBpbmRleFRvUmVtb3ZlKSB7XG4gICAgICAgIGlmIChpbmRleFRvUmVtb3ZlID49IDAgJiYgaW5kZXhUb1JlbW92ZSA8IGNvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBVdGlscy5kZWxldGVGcm9tQ29sbGVjdGlvbiA9IGRlbGV0ZUZyb21Db2xsZWN0aW9uO1xuICAgIC8qKiBDaGVja3MgaWYgYSB2YWx1ZSBpcyBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLiAqL1xuICAgIGZ1bmN0aW9uIGlzQmV0d2VlblJhbmdlKHZhbHVlLCBtaW4sIG1heCkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPj0gbWluICYmIHZhbHVlIDw9IG1heDtcbiAgICB9XG4gICAgVXRpbHMuaXNCZXR3ZWVuUmFuZ2UgPSBpc0JldHdlZW5SYW5nZTtcbiAgICAvKiogQ29udmVydHMgYW4gYW5nbGUgaW4gcmFkaWFucyB0byBhIDJEIHZlY3Rvci4gKi9cbiAgICBmdW5jdGlvbiBhbmdsZVRvVmVjdG9yKGFuZ2xlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBNYXRoLmNvcyhhbmdsZSksXG4gICAgICAgICAgICB5OiBNYXRoLnNpbihhbmdsZSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgVXRpbHMuYW5nbGVUb1ZlY3RvciA9IGFuZ2xlVG9WZWN0b3I7XG4gICAgLyoqIENvbnZlcnRzIGEgMkQgdmVjdG9yIHRvIGFuIGFuZ2xlIGluIHJhZGlhbnMuICovXG4gICAgZnVuY3Rpb24gdmVjdG9yVG9BbmdsZSh2ZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodmVjdG9yLnksIHZlY3Rvci54KTtcbiAgICB9XG4gICAgVXRpbHMudmVjdG9yVG9BbmdsZSA9IHZlY3RvclRvQW5nbGU7XG4gICAgLyoqIENvbnZlcnRzIGRlZ3JlZXMgdG8gcmFkaWFucy4gKi9cbiAgICBmdW5jdGlvbiB0b1JhZGlhbnMoYW5nbGVJbkRlZ3JlZXMpIHtcbiAgICAgICAgcmV0dXJuIGFuZ2xlSW5EZWdyZWVzICogKE1hdGguUEkgLyAxODApO1xuICAgIH1cbiAgICBVdGlscy50b1JhZGlhbnMgPSB0b1JhZGlhbnM7XG4gICAgLyoqIENvbnZlcnRzIHJhZGlhbnMgdG8gZGVncmVlcy4gKi9cbiAgICBmdW5jdGlvbiB0b0RlZ3JlZXMoYW5nbGVJblJhZGlhbnMpIHtcbiAgICAgICAgcmV0dXJuIGFuZ2xlSW5SYWRpYW5zICogKDE4MCAvIE1hdGguUEkpO1xuICAgIH1cbiAgICBVdGlscy50b0RlZ3JlZXMgPSB0b0RlZ3JlZXM7XG4gICAgZnVuY3Rpb24gY29tcHJlc3Mocykge1xuICAgICAgICBjb25zdCBkaWN0ID0geyBDaGFyYWN0ZXJEYXRhOiAyNTUgfTsgLy8gaW5pdGlhbCBzcGVjaWFsIHRva2VuXG4gICAgICAgIGNvbnN0IGRhdGEgPSBzLnNwbGl0KFwiXCIpO1xuICAgICAgICBjb25zdCBvdXQgPSBbXTtcbiAgICAgICAgbGV0IHBocmFzZSA9IGRhdGFbMF07XG4gICAgICAgIGxldCBjb2RlID0gMjU2O1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJDaGFyID0gZGF0YVtpXTtcbiAgICAgICAgICAgIGlmIChkaWN0W3BocmFzZSArIGN1cnJDaGFyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcGhyYXNlICs9IGN1cnJDaGFyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gUHVzaCBjaGFyIGNvZGUgaWYgc2luZ2xlIGNoYXJhY3Rlciwgb3RoZXJ3aXNlIGRpY3Rpb25hcnkgdmFsdWVcbiAgICAgICAgICAgICAgICBvdXQucHVzaChwaHJhc2UubGVuZ3RoID4gMSA/IGRpY3RbcGhyYXNlXSA6IHBocmFzZS5jaGFyQ29kZUF0KDApKTtcbiAgICAgICAgICAgICAgICBkaWN0W3BocmFzZSArIGN1cnJDaGFyXSA9IGNvZGU7XG4gICAgICAgICAgICAgICAgY29kZSsrO1xuICAgICAgICAgICAgICAgIHBocmFzZSA9IGN1cnJDaGFyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG91dC5wdXNoKHBocmFzZS5sZW5ndGggPiAxID8gZGljdFtwaHJhc2VdIDogcGhyYXNlLmNoYXJDb2RlQXQoMCkpO1xuICAgICAgICAvLyBDb252ZXJ0IG51bWJlcnMgdG8gY2hhcmFjdGVyc1xuICAgICAgICBjb25zdCBjb21wcmVzc2VkID0gb3V0Lm1hcChjID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoYykpLmpvaW4oXCJcIik7XG4gICAgICAgIHJldHVybiBjb21wcmVzc2VkO1xuICAgIH1cbiAgICBVdGlscy5jb21wcmVzcyA9IGNvbXByZXNzO1xuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKG4pIHtcbiAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbiAgICB9XG4gICAgVXRpbHMuaXNOdW1iZXIgPSBpc051bWJlcjtcbn0pKFV0aWxzIHx8IChVdGlscyA9IHt9KSk7XG4vKipcbiAqXG4gKiBAY29tbWVudFxuICAgIG1vZHVsZSBOb3RpZnlcbiAgICB7XG4gICAgICAgIGV4cG9ydCB2YXIgbG9ja2VkID0gZmFsc2U7XG4gICAgICAgIGV4cG9ydCB2YXIgbGV2ZWxzID0ge1xuICAgICAgICAgICAgc3VjZXNzOiBcImFsZXJ0LXN1Y2Nlc3NcIixcbiAgICAgICAgICAgIHdhcm46IFwiYWxlcnQtd2FyblwiLFxuICAgIC4uLlxuICAgIH1cbiAgICBtb3ZlIHRvIG5vdGlmeS50c1xuXG4vKlxubW9kdWxlIExvZ2dlclxue1xuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGxvZyhtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgaWYgKFNldHRpbmdzLkRFVkVMT1BNRU5UX01PREUgfHwgU2V0dGluZ3MuTE9HKVxuICAgICAgICAgICAgY29uc29sZS5pbmZvKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiB3YXJuKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBpZiAoU2V0dGluZ3MuREVWRUxPUE1FTlRfTU9ERSB8fCBTZXR0aW5ncy5MT0cpXG4gICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlYnVnKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBpZiAoU2V0dGluZ3MuREVWRUxPUE1FTlRfTU9ERSB8fCBTZXR0aW5ncy5MT0cgKVxuICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGVycm9yKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBpZiAoU2V0dGluZ3MuREVWRUxPUE1FTlRfTU9ERSB8fCBTZXR0aW5ncy5MT0cpXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbn1cbiovXG4vKipcbm1vdmVkXG5tb2R1bGUgVG91Y2hVSVxue1xuLi5cbn1cbnRvIHRvdWNodWkudHNcbiovXG4vKipcbiAqIG1vdmVkXG4gIG1vZHVsZSBrZXlib2FyZDtcbiAgdG8ga2V5Ym9hcmQudHNcbiAgKi8gXG4iLCIvKipcbiAqIEBuYW1lc3BhY2UgTWF0aFV0aWxzXG4gKiBAZGVzY3JpcHRpb24gVXRpbGl0eSBmdW5jdGlvbnMgZm9yIGNvbW1vbiBtYXRoZW1hdGljYWwgb3BlcmF0aW9ucy5cbiAqIEBhdXRob3IgZW5vb2xhXG4gKiBAdmVyc2lvbiAwLjAuMVxuICovXG4vL2V4dHJhY3RlZCBmcm9tIFNldHRpbmdzLnRzXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi4vdXRpbHMvbG9nZ2VyXCI7XG5leHBvcnQgdmFyIFRvdWNoVUk7XG4oZnVuY3Rpb24gKFRvdWNoVUkpIHtcbiAgICB2YXIgaXNGaXJlSGVsZCA9IGZhbHNlO1xuICAgIHZhciBpc0p1bXBQcmVzc2VkID0gZmFsc2U7XG4gICAgZnVuY3Rpb24gaXNUb3VjaERldmljZSgpIHtcbiAgICAgICAgLy9vcmlnLiByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8IG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzO1xuICAgICAgICAvL2l0IGRvZXNuJ3QgZXhpc3RzIGFueW1vcmVcbiAgICAgICAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHM7XG4gICAgfVxuICAgIFRvdWNoVUkuaXNUb3VjaERldmljZSA9IGlzVG91Y2hEZXZpY2U7XG4gICAgO1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIGlmIChUb3VjaFVJLmlzVG91Y2hEZXZpY2UoKSkge1xuICAgICAgICAgICAgdmFyIGZpcmVCdXR0b25Dc3NJZCA9IFwidG91Y2hGaXJlQnV0dG9uXCI7XG4gICAgICAgICAgICB2YXIganVtcEJ1dHRvbkNzc0lkID0gXCJ0b3VjaEp1bXBcIjtcbiAgICAgICAgICAgIC8vVXNpbmcgdGhpcyB0byBhbHNvIGluc2VydCB0aGUgdG91Y2ggY29udHJvbHMgZm9yIHRhYmxldHNcbiAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPXRvdWNoQnV0dG9uIGlkPVwiICsgZmlyZUJ1dHRvbkNzc0lkICsgXCI+RmlyZTwvZGl2PlwiKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPXRvdWNoQnV0dG9uIGlkPVwiICsganVtcEJ1dHRvbkNzc0lkICsgXCI+SnVtcDwvZGl2PlwiKTtcbiAgICAgICAgICAgICQoXCIjXCIgKyBmaXJlQnV0dG9uQ3NzSWQpLmJpbmQoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpc0ZpcmVIZWxkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBMb2dnZXIubG9nKFwidG91Y2hzdGFydGVkXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKFwiI1wiICsgZmlyZUJ1dHRvbkNzc0lkKS5iaW5kKFwidG91Y2hlbmRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpc0ZpcmVIZWxkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZyhcInRvdWNoZW5kXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKFwiI1wiICsganVtcEJ1dHRvbkNzc0lkKS5iaW5kKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaXNKdW1wUHJlc3NlZCA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoXCIjXCIgKyBqdW1wQnV0dG9uQ3NzSWQpLmJpbmQoXCJ0b3VjaGVuZFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlzSnVtcFByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFRvdWNoVUkuaW5pdCA9IGluaXQ7XG4gICAgZnVuY3Rpb24gaXNGaXJlQnV0dG9uRG93bihyZXNldCA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChpc0ZpcmVIZWxkICYmIHJlc2V0KSB7XG4gICAgICAgICAgICBpc0ZpcmVIZWxkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNGaXJlSGVsZDtcbiAgICB9XG4gICAgVG91Y2hVSS5pc0ZpcmVCdXR0b25Eb3duID0gaXNGaXJlQnV0dG9uRG93bjtcbiAgICBmdW5jdGlvbiBpc0p1bXBEb3duKHJlc2V0ID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGlzSnVtcFByZXNzZWQgJiYgcmVzZXQpIHtcbiAgICAgICAgICAgIGlzSnVtcFByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0p1bXBQcmVzc2VkO1xuICAgIH1cbiAgICBUb3VjaFVJLmlzSnVtcERvd24gPSBpc0p1bXBEb3duO1xufSkoVG91Y2hVSSB8fCAoVG91Y2hVSSA9IHt9KSk7XG4iLCJpbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi9TZXR0aW5nc1wiO1xuLyoqXG4gKiBAbmFtZXNwYWNlIExvZ2dlclxuICogQGRlc2NyaXB0aW9uIFV0aWxpdHkgZnVuY3Rpb25zIHBpY2tlZCBmcm9tIHV0aWxzLnRzIGZpbGUgYW5kIHJlZmFjdG9yZWQgd2l0aCBxd2VuXG4gKiBAYXV0aG9yIHF3ZW5vbGFcbiAqIEB2ZXJzaW9uIDEuMC4wXG4gKiBAZGF0ZSAyMDI1MDYxM1xuICovXG5leHBvcnQgY29uc3QgTG9nZ2VyID0ge1xuICAgIGxvZyhtZXNzYWdlKSB7XG4gICAgICAgIGlmIChTZXR0aW5ncy5ERVZFTE9QTUVOVF9NT0RFIHx8IFNldHRpbmdzLkxPRylcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhtZXNzYWdlKTtcbiAgICB9LFxuICAgIHdhcm4obWVzc2FnZSkge1xuICAgICAgICBpZiAoU2V0dGluZ3MuREVWRUxPUE1FTlRfTU9ERSB8fCBTZXR0aW5ncy5MT0cpXG4gICAgICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4gICAgfSxcbiAgICBkZWJ1ZyhtZXNzYWdlKSB7XG4gICAgICAgIGlmIChTZXR0aW5ncy5ERVZFTE9QTUVOVF9NT0RFIHx8IFNldHRpbmdzLkxPRylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgIH0sXG4gICAgZXJyb3IobWVzc2FnZSkge1xuICAgICAgICBpZiAoU2V0dGluZ3MuREVWRUxPUE1FTlRfTU9ERSB8fCBTZXR0aW5ncy5MT0cpXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbn07XG4iLCIvKipcbiAqIEBuYW1lc3BhY2UgTG9nZ2VyXG4gKiBAZGVzY3JpcHRpb24gVXRpbGl0eSBmdW5jdGlvbnMgcGlja2VkIGZyb20gdXRpbHMudHMgZmlsZVxuICogQGF1dGhvciBxd2Vub2xhXG4gKiBAdmVyc2lvbiAxLjAuMFxuICogQGRhdGUgMjAyNTA2MTNcbiAqL1xuZXhwb3J0IHZhciBOb3RpZnk7XG4oZnVuY3Rpb24gKE5vdGlmeSkge1xuICAgIE5vdGlmeS5sb2NrZWQgPSBmYWxzZTtcbiAgICBOb3RpZnkubGV2ZWxzID0ge1xuICAgICAgICBzdWNlc3M6IFwiYWxlcnQtc3VjY2Vzc1wiLFxuICAgICAgICB3YXJuOiBcImFsZXJ0LXdhcm5cIixcbiAgICAgICAgZXJyb3I6IFwiYWxlcnQtZXJyb3JcIlxuICAgIH07XG4gICAgZnVuY3Rpb24gZGlzcGxheShoZWFkZXIsIG1lc3NhZ2UsIGF1dG9IaWRlVGltZSA9IDI4MDAsIGNzc1N0eWxlID0gTm90aWZ5LmxldmVscy5zdWNlc3MsIGRvTm90T3ZlcldyaXRlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCFOb3RpZnkubG9ja2VkKSB7XG4gICAgICAgICAgICBOb3RpZnkubG9ja2VkID0gZG9Ob3RPdmVyV3JpdGU7XG4gICAgICAgICAgICAkKFwiI25vdGlmYWN0aW9uXCIpLnJlbW92ZUNsYXNzKE5vdGlmeS5sZXZlbHMud2Fybik7XG4gICAgICAgICAgICAkKFwiI25vdGlmYWN0aW9uXCIpLnJlbW92ZUNsYXNzKE5vdGlmeS5sZXZlbHMuZXJyb3IpO1xuICAgICAgICAgICAgJChcIiNub3RpZmFjdGlvblwiKS5yZW1vdmVDbGFzcyhOb3RpZnkubGV2ZWxzLnN1Y2Vzcyk7XG4gICAgICAgICAgICAkKFwiI25vdGlmYWN0aW9uXCIpLmFkZENsYXNzKGNzc1N0eWxlKTtcbiAgICAgICAgICAgICQoXCIjbm90aWZhY3Rpb24gc3Ryb25nXCIpLmVtcHR5KCk7XG4gICAgICAgICAgICAkKFwiI25vdGlmYWN0aW9uIHN0cm9uZ1wiKS5odG1sKGhlYWRlcik7XG4gICAgICAgICAgICAkKFwiI25vdGlmYWN0aW9uIHBcIikuZW1wdHkoKTtcbiAgICAgICAgICAgICQoXCIjbm90aWZhY3Rpb24gcFwiKS5odG1sKG1lc3NhZ2UpO1xuICAgICAgICAgICAgJChcIiNub3RpZmFjdGlvblwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICB0b3A6IChwYXJzZUludCgkKFwiI25vdGlmYWN0aW9uXCIpLmNzcyhcImhlaWdodFwiKSkpICsgXCJweFwiXG4gICAgICAgICAgICB9LCA0MDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXV0b0hpZGVUaW1lID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGhpZGUsIGF1dG9IaWRlVGltZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgTm90aWZ5LmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIC8qXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGhpZGUoY2FsbGJhY2spXG4gICAge1xuICAgICAgICBpZiAoIWxvY2tlZClcbiAgICAgICAge1xuICAgICAgICAgICAgJChcIiNub3RpZmFjdGlvblwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICB0b3A6ICgtcGFyc2VJbnQoJChcIiNub3RpZmFjdGlvblwiKS5jc3MoXCJoZWlnaHRcIikpKSAtIDEwMCArIFwicHhcIlxuICAgICAgICAgICAgfSwgNDAwLCBmdW5jdGlvbiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrOiBhbnkgIT0gbnVsbClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKi9cbiAgICBmdW5jdGlvbiBoaWRlKGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0ICRub3RpZmljYXRpb24gPSAkKFwiI25vdGlmaWNhdGlvblwiKTtcbiAgICAgICAgaWYgKCFOb3RpZnkubG9ja2VkKSB7XG4gICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBwYXJzZUludCgkbm90aWZpY2F0aW9uLmNzcyhcImhlaWdodFwiKSwgMTApO1xuICAgICAgICAgICAgTm90aWZ5LmxvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAkbm90aWZpY2F0aW9uLmFuaW1hdGUoeyB0b3A6IC1oZWlnaHQgLSAxMDAgKyBcInB4XCIgfSwgNDAwLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgTm90aWZ5LmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIE5vdGlmeS5oaWRlID0gaGlkZTtcbn0pKE5vdGlmeSB8fCAoTm90aWZ5ID0ge30pKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBtYWluLnRzXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gJy4vU2V0dGluZ3MnO1xuaW1wb3J0IHsgR3JhcGhpY3MgfSBmcm9tICcuL3N5c3RlbS9HcmFwaGljcyc7XG5pbXBvcnQgeyBTdGFydE1lbnUgfSBmcm9tICcuL2d1aS9TdGFydE1lbnUnO1xuaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4vR2FtZSc7XG5pbXBvcnQgQXNzZXRNYW5hZ2VyIGZyb20gJy4vc3lzdGVtL0Fzc2V0TWFuYWdlcic7XG5sZXQgR2FtZUluc3RhbmNlO1xuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICAgIFNldHRpbmdzLmdldFNldHRpbmdzRnJvbVVybCgpO1xuICAgIGlmICghU2V0dGluZ3MuUlVOX1VOSVRfVEVTVF9PTkxZKSB7XG4gICAgICAgIEdhbWVJbnN0YW5jZSA9IG5ldyBHYW1lKCk7XG4gICAgICAgIGNvbnN0IHN0YXJ0TWVudSA9IG5ldyBTdGFydE1lbnUoR2FtZUluc3RhbmNlKTtcbiAgICAgICAgQXNzZXRNYW5hZ2VyLmxvYWRBc3NldHMoKTtcbiAgICAgICAgc3RhcnRNZW51Lm9uR2FtZVJlYWR5KCgpID0+IHtcbiAgICAgICAgICAgIHN0YXJ0TWVudS5oaWRlKCk7XG4gICAgICAgICAgICBpZiAoIUdhbWVJbnN0YW5jZS5zdGF0ZS5pc1N0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICBHYW1lSW5zdGFuY2Uuc3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdhbWVsb29wKCkge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICBpZiAoU2V0dGluZ3MuREVWRUxPUE1FTlRfTU9ERSkge1xuICAgICAgICAgICAgICAgICAgICAoX2EgPSBHcmFwaGljcy5zdGF0cykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnVwZGF0ZSgpOyAvLyBPcHRpb25hbCBjaGFpbmluZyBpbiBjYXNlIHN0YXRzIGlzIG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgR2FtZUluc3RhbmNlLnN0ZXAoKTtcbiAgICAgICAgICAgICAgICBHYW1lSW5zdGFuY2UudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgR2FtZUluc3RhbmNlLmRyYXcoKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVsb29wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdhbWVsb29wKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9