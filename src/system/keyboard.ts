/**
 * @namespace keyboard
 * @description Utility functions picked from utils.ts file and refactored with qwen
 * @author qwenola
 * @version 1.0.0
 */
export namespace keyboard {
    /**
       * Map of key names to keycodes.
       */
    export const keyCodes = {
        'Backspace': 8,
        'Tab': 9,
        'Enter': 13,
        'Shift': 16,
        'Ctrl': 17,
        'Alt': 18,
        'Pause': 19,
        'Capslock': 20,
        'Esc': 27,
        'Pageup': 33,
        'Space': 32,
        'Pagedown': 34,
        'End': 35,
        'Home': 36,
        'Leftarrow': 37,
        'Uparrow': 38,
        'Rightarrow': 39,
        'Downarrow': 40,
        'Insert': 45,
        'Delete': 46,
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        'a': 65,
        'b': 66,
        'c': 67,
        'd': 68,
        'e': 69, // Fixed: was 101 originally (incorrect)
        'f': 70,
        'g': 71,
        'h': 72,
        'i': 73,
        'j': 74,
        'k': 75,
        'l': 76,
        'm': 77,
        'n': 78,
        'o': 79,
        'p': 80,
        'q': 81,
        'r': 82,
        's': 83,
        't': 84,
        'u': 85,
        'v': 86,
        'w': 87,
        'x': 88,
        'y': 89,
        'z': 90,
        'numpad0': 96,
        'numpad1': 97,
        'numpad2': 98,
        'numpad3': 99,
        'numpad4': 100,
        'numpad5': 101, // Added missing numpad5
        'numpad6': 102,
        'numpad7': 103,
        'numpad8': 104,
        'numpad9': 105,
        'Multiply': 106,
        'Plus': 107,
        'Minus': 109, // Corrected typo: "Minut" -> "Minus"
        'Dot': 110,
        'Slash1': 111,
        'F1': 112,
        'F2': 113,
        'F3': 114,
        'F4': 115,
        'F5': 116,
        'F6': 117,
        'F7': 118,
        'F8': 119,
        'F9': 120,
        'F10': 121,
        'F11': 122,
        'F12': 123,
        'equal': 187,
        'Comma': 188, // Fixed typo: "Coma" -> "Comma"
        'Slash': 191,
        'Backslash': 220
    } as const;

    export type KeyCodeName = keyof typeof keyCodes;
    // Create a reverse map for keycode to key name
    type KeyCodes = typeof keyCodes;
    type KeyName = keyof KeyCodes;

    // Track currently pressed keys by their keyCode
    const keys: Record<number, boolean> = {};

    // Initialize event listeners
    (() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keys[e.keyCode] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            delete keys[e.keyCode];
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Cleanup on unload (optional)
        window.addEventListener('beforeunload', () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        });
    })();

    /**
     * Checks if a key is currently down.
     * @param keyCode - The key code to check.
     * @param actLikeKeyPress - If true, it "consumes" the key press (like a one-time trigger).
     */
    export function isKeyDown(keyCode: number, actLikeKeyPress = false): boolean {
        const isDown = !!keys[keyCode];

        if (actLikeKeyPress && isDown) {
            delete keys[keyCode];
        }

        return isDown;
    }



    // Function to get key name from code
    /*
    * @function getKeyName_ Gets the name of a key from its keycode. (still legacy but safer)
    * @param keycode - The numeric keycode.
    * @returns The key name or undefined.
    *

    export function getKeyName(keycode: number): KeyName | undefined {
        for (const key in keyCodes) {
            if (keyCodes.hasOwnProperty(key)) {
                const typedKey = key as KeyName; // Safe cast due to `as const`
                if (keyCodes[typedKey] === keycode) {
                    return typedKey;
                }
            }
        }
        return undefined;
    }
    */
    
    /**
     * @function keyCodeToKey add reverse map for better performance
     * @param keyCodes
     */
    const keyCodeToKey = Object.keys(keyCodes).reduce((acc, key) => {
        const typedKey = key as KeyName;
        acc[keyCodes[typedKey]] = typedKey;
        return acc;
    }, {} as Record<number, KeyName>);

    /**
    * @function getKeyName Gets the name of a key from its keycode. (This version uses a lookup table and is faster than looping every time, legacy still)
    * @param keycode - The numeric keycode.
    * @returns The key name or undefined.
    */
    export function getKeyName(keycode: number): KeyName | undefined {
        return keyCodeToKey[keycode];
    }
  
}