/**
 * @namespace Logger
 * @description Utility functions picked from utils.ts file
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */
export var Notify;
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
