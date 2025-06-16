import { Drill } from "../weapons/Drill";
import { HolyGrenade } from "../weapons/HolyGrenade";
import { HandGrenade } from "../weapons/HandGrenade";
import { Dynamite } from "../weapons/Dynamite";
import { NinjaRope } from "../weapons/NinjaRope";
import { JetPack } from "../weapons/JetPack";
import { Shotgun } from "../weapons/Shotgun";
import { Minigun } from "../weapons/Minigun";
class WeaponManager {
    constructor() {
        this.weaponsAndTools =
            [
                new Shotgun(99),
                new HandGrenade(20),
                new HolyGrenade(2),
                new Dynamite(5),
                // new LandMine(10), //Not finished
                new JetPack(5),
                new Minigun(4), //Bug: might take out for final demo          
                new NinjaRope(50),
                new Drill(3),
                // new Blowtorch(3), //not finished
                new Bazzoka(15)
            ];
        this.currentWeaponIndex = 1;
    }
    checkWeaponHasAmmo(weaponIndex) {
        if (this.weaponsAndTools[weaponIndex].ammo) {
            return true;
        }
        return false;
    }
    getCurrentWeapon() {
        return this.weaponsAndTools[this.currentWeaponIndex];
    }
    setCurrentWeapon(index) {
        //Allows the user to switch weapon once its active if its a jetpack or ninjia rope
        if (this.getCurrentWeapon().getIsActive() == false || this.getCurrentWeapon() instanceof JetPack || this.getCurrentWeapon() instanceof NinjaRope) {
            if (this.getCurrentWeapon() instanceof NinjaRope) {
                this.getCurrentWeapon().deactivate();
            }
            this.currentWeaponIndex = index;
        }
    }
    getListOfWeapons() {
        return this.weaponsAndTools;
    }
}
