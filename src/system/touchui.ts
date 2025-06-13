/**
 * @namespace MathUtils
 * @description Utility functions for common mathematical operations.
 * @author enoola
 * @version 0.0.1
 */

//extracted from Settings.ts

import { Logger } from "../utils/logger"


export namespace TouchUI {
    var isFireHeld = false;
    var isJumpPressed = false;

    export function isTouchDevice() {
        //orig. return 'ontouchstart' in window || navigator.msMaxTouchPoints;
        //it doesn't exists anymore
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    };


    export function init() {
        if (TouchUI.isTouchDevice()) {
            var fireButtonCssId = "touchFireButton";
            var jumpButtonCssId = "touchJump";
            //Using this to also insert the touch controls for tablets
            $('body').append("<div class=touchButton id=" + fireButtonCssId + ">Fire</div>");
            $('body').append("<div class=touchButton id=" + jumpButtonCssId + ">Jump</div>");

            $("#" + fireButtonCssId).bind('touchstart', function (e) {
                e.preventDefault();
                isFireHeld = true;
                Logger.log("touchstarted");
            });


            $("#" + fireButtonCssId).bind("touchend", function (e) {
                isFireHeld = false;
                Logger.log("touchend");
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


    export function isFireButtonDown(reset = false) {
        if (isFireHeld && reset) {
            isFireHeld = false;
            return true;
        }

        return isFireHeld;
    }

    export function isJumpDown(reset = false) {
        if (isJumpPressed && reset) {
            isJumpPressed = false;
            return true;
        }

        return isJumpPressed;
    }




}
