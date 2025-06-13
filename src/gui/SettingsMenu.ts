// SettingsMenu.ts

import { Maps } from "../environment/Maps"; // Adjust path as needed
import { AssetManager } from "../system/AssetManager";
import { formatString } from "../system/Utils";
import { Game } from "../Game";

export class SettingsMenu {
    private view: string;
    public levelName: string;

    private CSS_ID = {
        MAP_LIST_DIV: "#maps"
    };

    constructor() {
        // Default selected map
        this.levelName = Maps.pirates.name;

        // Start building the view
        let mapsList = `
            <div id="mapSelector">
                <h1 style="text-align: center">Select a Map</h1>
                <div class="row-fluid" style="text-align: center">
                    <ul class="thumbnails">
        `;

        for (const mapKey in Maps) {
            if (Object.prototype.hasOwnProperty.call(Maps, mapKey)) {
                mapsList += this.addMapItem(Maps[mapKey], mapKey);
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

    addMapItem(map: any, name: string): string {
        const thumbnailTemplate = `
            <li class="span4" style="width:30%">
                <a href="#" class="thumbnail" id="{0}">
                    <img style="width: 160px; height: 80px;" src="{1}" />
                </a>
            </li>
        `;

        return formatString(thumbnailTemplate, name, AssetManager.getImage(map.smallImage).src);
    }

    bind(callback: () => void): void {
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
                Game.map = new Map(Maps[levelId]); // Assumes Map class exists
                callback();
            }
        });
    }

    getLevelName(): string {
        return this.levelName;
    }

    getView(): string {
        return this.view;
    }
}