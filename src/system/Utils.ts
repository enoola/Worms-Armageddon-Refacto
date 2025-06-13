/**
 * Utitles 
 * This namespace contains helper functions that I use a lot around the code base
 * or encapluate snippets of code I use a lot in the codebase though by naming it 
 * asa function gives the code more readablity.
 *
 * Logger
 * Just wraps the console.log functions alloing me to switch them on and off easily
 *
 * Keyboard
 * Keeps track of which keys are pressed and allows for polling in gameloop
 * which is faster then event based input.
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
import { Settings } from "../Settings"
import { Physics } from "./Physics"
import { Logger } from "../utils/logger"
import { AssetManager } from "./AssetManager"
import { Sound } from "./"
//declare var $;
//Declare jQuery type - safe global(optional, if still using jQuery)
declare const $: any;
  
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
export function formatString(template: string, ...args: string[]): string {
    return template.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== "undefined" ? args[number] : match;
    });
}


export namespace Utils {

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
    function isDate(value: any): value is Date {
        return value instanceof Date;
    }
    
    /**
    * @function copy copies all properties from source to target.
    * Mutates the target object.
    */
        export function copy<T extends Record<string, any>>(target: T, source: Partial<T>): T {
        for (const key in source) {
            if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

            const value = source[key];

            if (value === null || value === undefined) {
                (target[key] as any) = value;
                continue;
            }

            // Handle Date
            
            if (isDate(value)) {
                target[key] = new Date(value) as any;
                continue;
            }

            // Handle Array
            if (Array.isArray(value)) {
                target[key] = ([] as any[]).concat(
                    value.map(item => (typeof item === "object" ? copy({}, item) : item))
                ) as any;
                continue;
            }

            // Handle Object
            if (typeof value === "object") {
                if (!(key in target) || typeof target[key] !== "object" || target[key] === null) {
                    target[key] = {} as any;
                }
                copy(target[key], value);
                continue;
            }

            // Primitive values
            target[key] = value;
        }

        return target;
    }

    export function sign(x: number) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

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
    export function findByValue<T extends Record<K, V>, K extends keyof any, V>(
        needle: V,
        haystack: T[],
        haystackProperty: K
    ): T {
        const result = haystack.find(item => item[haystackProperty] === needle);

        if (!result) {
            throw new Error(`Couldn't find object with property "${String(haystackProperty)}" equal to ${String(needle)}`);
        }

        return result;
    }

    //added types
    export function random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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
    export function pickRandom<T>(array: T[]): T | undefined {
        if (array.length === 0) return undefined;

        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

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
    const pickUniqueCollection: Record<string, any[]> = {};

    export function pickUnique<T>(collection: T[], stringId: string): T | undefined {
        let items = pickUniqueCollection[stringId];

        if (!items) {
            // First time: store the collection
            pickUniqueCollection[stringId] = [...collection]; // copy to avoid mutating original
            items = pickUniqueCollection[stringId];
        }

        if (items.length <= 0) {
            Logger.error("Out of unique items in collection: " + stringId);
            return undefined;
        }

        const index = Math.floor(Math.random() * items.length);
        const item = items[index];

        // Remove item at index
        items.splice(index, 1);

        return item;
    }


    export function pickRandomSound(collection: string[]) {
        var sound: Sound = AssetManager.getSound(collection[random(0, collection.length - 1)]);

        if (!sound.play) {
            Logger.warn(" Somthing looks dogoy with the sound object " + sound);
        }

        return sound;
    }


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
    export function deleteFromCollection<T>(collection: T[], indexToRemove: number): void {
        if (indexToRemove >= 0 && indexToRemove < collection.length) {
            collection.splice(indexToRemove, 1);
        }
    }

    /** Checks if a value is between min and max (inclusive). */
    export function isBetweenRange(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }

    /** Converts an angle in radians to a 2D vector. */
    export function angleToVector(angle: number): { x: number; y: number } {
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    /** Converts a 2D vector to an angle in radians. */
    export function vectorToAngle(vector: { x: number; y: number }): number {
        return Math.atan2(vector.y, vector.x);
    }

    /** Converts degrees to radians. */
    export function toRadians(angleInDegrees: number): number {
        return angleInDegrees * (Math.PI / 180);
    }

    /** Converts radians to degrees. */
    export function toDegrees(angleInRadians: number): number {
        return angleInRadians * (180 / Math.PI);
    }
    //export function isBetweenRangeTest()
    //{
    //    var t1 = isBetweenRange(3.3, 10, -10);
    //    var t2 = isBetweenRange(-2.3, 40, -3);
    //    var t3 = isBetweenRange(-25.3, 40, -3);

    //    if ( t1 == false || t2 == false || t3 == true)
    //    {
    //        Logger.error(" isBetweenRangeTestFailed ");
    //    } else
    //    {
    //        Logger.log("isBetweenTestPassed");
    //    }
    //};


    // Assuming CharacterData is a class or constructor (adjust accordingly)
    interface CharacterData {
        // define structure if needed
    }

    declare const CharacterData: {
        new(): CharacterData;
        prototype: CharacterData;
    };

    export function compress(s: string): string {
        const dict: { [key: string]: number } = { CharacterData: 255 }; // initial special token
        const data = s.split("");
        const out: number[] = [];
        let phrase = data[0];
        let code = 256;

        for (let i = 1; i < data.length; i++) {
            const currChar = data[i];

            if (dict[phrase + currChar] !== undefined) {
                phrase += currChar;
            } else {
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

    export function isNumber(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

}



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