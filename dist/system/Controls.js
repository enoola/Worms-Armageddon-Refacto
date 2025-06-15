import { keyboard } from "./keyboard";
export class OneControl {
}
//export namespace Controls
export const weapons = {
    jetPackFlamesDown: {
        imageName: "wjetflmd",
        frameY: 0,
        frameCount: 6,
        msPerFrame: 100,
    },
    toggleWeaponMenu = {
        gamepad: -1,
        keyboard: 101,
        mouse: 3
    },
    var: walkLeft =
        {
            gamepad: -1,
            keyboard: 65,
            mouse: -1
        },
    var: walkRight =
        {
            gamepad: -1,
            keyboard: 68,
            mouse: -1
        },
    var: jump =
        {
            gamepad: -1,
            keyboard: 32,
            mouse: -1
        },
    var: backFlip =
        {
            gamepad: -1,
            keyboard: keyboard.keyCodes.Backspace,
            mouse: -1
        },
    var: aimUp =
        {
            gamepad: -1,
            keyboard: 87,
            mouse: -1
        },
    var: aimDown =
        {
            gamepad: -1,
            keyboard: 83,
            mouse: -1
        },
    var: fire =
        {
            gamepad: -1,
            keyboard: 13,
            mouse: 1
        },
    function: checkControls(control, Controls, key)
};
{
    return (key == control.gamepad || key == control.keyboard || key == control.mouse);
}
