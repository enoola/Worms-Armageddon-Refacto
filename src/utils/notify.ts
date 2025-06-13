
/**
 * @namespace Logger
 * @description Utility functions picked from utils.ts file
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */

export namespace Notify {
    export var locked = false;
    export var levels = {
        sucess: "alert-success",
        warn: "alert-warn",
        error: "alert-error"
    };

    export function display(header: string, message: string, autoHideTime = 2800, cssStyle = Notify.levels.sucess, doNotOverWrite = false) {
        if (!locked) {
            locked = doNotOverWrite;
            $("#notifaction").removeClass(levels.warn);
            $("#notifaction").removeClass(levels.error);
            $("#notifaction").removeClass(levels.sucess);
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


    export function hide(callback?: () => void): void {
        const $notification = $("#notification");

        if (!locked) {
            const height = parseInt($notification.css("height"), 10);
            locked = true;

            $notification.animate(
                { top: -height - 100 + "px" },
                400,
                () => {
                    locked = false;
                    if (callback) {
                        callback();
                    }
                }
            );
        }
    }

}
