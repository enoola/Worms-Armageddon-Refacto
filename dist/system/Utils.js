import { Logger } from "../utils/logger";
import { AssetManager } from "./AssetManager";
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
export function formatString(template, ...args) {
    return template.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== "undefined" ? args[number] : match;
    });
}
export var Utils;
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
            Logger.error("Out of unique items in collection: " + stringId);
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
        var sound = AssetManager.getSound(collection[random(0, collection.length - 1)]);
        if (!sound.play) {
            Logger.warn(" Somthing looks dogoy with the sound object " + sound);
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
