export interface SpriteDefinition {
    imageName: string;
    frameY: number;
    frameCount: number;
    msPerFrame: number;
}

// Weapon icons
export const weaponIcons = {
    holyGrenade: { imageName: "iconhgrenade" },
    grenade: { imageName: "icongrenade" },
    drill: { imageName: "drill" },
    dynamite: { imageName: "icondynamite" },
    ninjaRope: { imageName: "iconrope" },
    jetPack: { imageName: "iconjetpack" },
    shotgun: { imageName: "iconshotgun" },
    minigun: { imageName: "iconminigun" },
    bazooka: { imageName: "iconbazooka" },
};

// Weapons animations
export const weapons = {
    jetPackFlamesDown: {
        imageName: "wjetflmd",
        frameY: 0,
        frameCount: 6,
        msPerFrame: 100,
    },
    jetPackFlamesSide: {
        imageName: "wjetflmb",
        frameY: 0,
        frameCount: 6,
        msPerFrame: 60,
    },
    holyGrenade: {
        imageName: "hgrenade",
        frameY: 0,
        frameCount: 32,
        msPerFrame: 10,
    },
    missle: {
        imageName: "missile",
        frameY: 9,
        frameCount: 32,
        msPerFrame: 10,
    },
    grenade: {
        imageName: "grenade",
        frameY: 0,
        frameCount: 32,
        msPerFrame: 10,
    },
    dynamite: {
        imageName: "dynamite",
        frameY: 0,
        frameCount: 129,
        msPerFrame: 50,
    },
    redTarget: {
        imageName: "crshairr",
        frameY: 0,
        frameCount: 32,
        msPerFrame: 50,
    },
    arrow: {
        imageName: "arrowdnb",
        frameY: 0,
        frameCount: 30,
        msPerFrame: 10,
    },
    ninjaRopeTip: {
        imageName: "ropecuff",
        frameY: 0,
        frameCount: 112,
        msPerFrame: 10,
    }
};

// Worm animations
export const worms = {
    idle1: {
        imageName: "wselbak",
        frameY: 0,
        frameCount: 12,
        msPerFrame: 200,
    },
    drilling: {
        imageName: "wdrill",
        frameY: 0,
        frameCount: 4,
        msPerFrame: 100,
    },
    walking: {
        imageName: "wwalk",
        frameY: 0,
        frameCount: 15,
        msPerFrame: 50,
    },
    falling: {
        imageName: "wfall",
        frameY: 0,
        frameCount: 2,
        msPerFrame: 100,
    },
    jumpBegin: {
        imageName: "wflyup",
        frameY: 0,
        frameCount: 2,
        msPerFrame: 100,
    },
    die: {
        imageName: "wdie",
        frameY: 0,
        frameCount: 60,
        msPerFrame: 5,
    },
};

// Particle effects
export const particleEffects = {
    eclipse: {
        imageName: "elipse75",
        frameY: 0,
        frameCount: 10,
        msPerFrame: 20,
    },
    flame1: {
        imageName: "flame1",
        frameY: 0,
        frameCount: 32,
        msPerFrame: 50,
    },
};