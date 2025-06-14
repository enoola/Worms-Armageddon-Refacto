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

import { Settings } from "../Settings";
import { Controls } from "../system/Controls";
import { AssetManager } from "../system/AssetManager";
import { Notify } from "../utils/notify"; // Assuming you have a Notify class/module
import { SettingsMenu } from "./SettingsMenu";
import { Game } from "../Game"; // Adjust path as needed
import { TouchUI } from "../system/touchui"; // Optional: assuming this exists

declare const $: any; // If still using jQuery, keep the declaration

/*
* we will make some change to not rely on an globaly available instance of Game e.g GameInstance
*/

export class StartMenu {
    private gameInstance: Game;
    private controlsView: string;
    public settingsMenu: SettingsMenu = new SettingsMenu;
    static callback: () => void;

    constructor(gameInstance: Game) {
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
                    <kbd>${String.fromCharCode(Controls.walkLeft.keyboard)}</kbd>
                    <kbd>${String.fromCharCode(Controls.walkRight.keyboard)}</kbd>
                    - Jump, Left, Right.<br><br>
                    <kbd>${String.fromCharCode(Controls.aimUp.keyboard)}</kbd>
                    <kbd>${String.fromCharCode(Controls.aimDown.keyboard)}</kbd>
                    - Aim up and down.<br><br>
                    <kbd>${String.fromCharCode(Controls.toggleWeaponMenu.keyboard)}</kbd> or right mouse - Weapon Menu.<br><br>
                    <kbd>Enter</kbd> - Fire weapon.
                </p><br>
                <a class="btn btn-primary btn-large" id="startLocal" style="text-align:center">Let's play!</a>
            </div>`;
    }

    hide(): void {
        $('#startMenu').remove();
    }

    onGameReady(callback: () => void): void {
        StartMenu.callback = callback;

        if (!Settings.DEVELOPMENT_MODE) {
            const loading = setInterval(() => {
                $('#notice').empty();

                if (AssetManager.getPerAssetsLoaded() >= 100) {
                    clearInterval(loading);
                    this.settingsMenu = new SettingsMenu();
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
                    } else if (TouchUI.isTouchDevice()) {
                        $('#notice').append(`
                            <div class="alert alert-warning" style="text-align:center">
                                <strong>Hey tablet user:</strong> There may be performance issues
                                and some missing features. But you can still play!
                            </div>`);
                    } else {
                        $('#startTutorial').removeAttr("disabled");
                        $('#notice').append(`
                            <div class="alert alert-success" style="text-align:center">
                                <strong>Games loaded and you're ready to play!!</strong><br>
                                Thanks for using a modern browser.
                                <a href="#" id="awesome">You're awesome!</a>
                            </div>`);
                        $('#awesome').off('click').on('click', () => {
                            Notify.display("Awesome!", "<img src='../data/images/awesome.jpg'/>", 5000);
                        });
                    }
                } else {
                    $('#notice').append(`
                        <div class="alert alert-info" style="text-align:center">
                            <strong>Stand back! I'm loading game assets!</strong>
                            <div class="progress progress-striped active">
                                <div class="bar" style="width: ${AssetManager.getPerAssetsLoaded()}%;"></div>
                            </div>
                        </div>`);
                }
            }, 500);

            $('#startLocal').off('click').on('click', () => {
                if (AssetManager.isReady()) {
                    AssetManager.getSound("CursorSelect").play();
                    $('.slide').empty();
                    $('.slide').append(this.settingsMenu.getView());
                    this.settingsMenu.bind(() => {
                        AssetManager.getSound("CursorSelect").play();
                        this.controlsMenu(callback);
                    });
                }
            });

            $('#startOnline').off('click').on('click', () => {
                if (AssetManager.isReady()) {
                    if (this.gameInstance.lobby.client_init() !== false) {
                        $('#notice').empty();
                        this.gameInstance.lobby.menu.show(callback);
                        AssetManager.getSound("CursorSelect").play();
                    } else {
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
                if (AssetManager.isReady()) {
                    AssetManager.getSound("CursorSelect").play();
                    this.gameInstance.tutorial = new Tutorial(); // Assumes Tutorial class exists
                    this.controlsMenu(callback);
                }
            });

        } else {
            // Development Mode
            const loading = setInterval(() => {
                if (AssetManager.getPerAssetsLoaded() === 100) {
                    clearInterval(loading);
                    callback();
                }
            }, 2);
        }
    }

    controlsMenu(callback: () => void): void {
        $('.slide').fadeOut('normal', () => {
            $('.slide').empty();
            $('.slide').append(this.controlsView).fadeIn('slow');

            $('#startLocal').off('click').on('click', () => {
                $('#startLocal').off('click');
                $('#splashScreen').remove();
                $('#startMenu').fadeOut('normal');
                AssetManager.getSound("CursorSelect").play();
                AssetManager.getSound("StartRound").play(1, 0.5);
                callback();
            });
        });
    }
}
