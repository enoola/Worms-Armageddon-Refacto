/**
 * WeaponManager.js
 * Each Team has a load of weapons that are managed by this class. 
 * It sotires the weapons, allow simple controlled accsse to the weapons.
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
import { BaseWeaponManager } from "../system/BaseWeaponManager"
import { AssetManager } from "../system/AssetManager"
import { Physics } from "../system/Physics"
import { Sprite } from "../animation/Sprite"
import { Drill } from "../weapons/Drill"
import { HolyGrenade } from "../weapons/HolyGrenade"
import { HandGrenade } from "../weapons/HandGrenade"
import { Dynamite } from "../weapons/Dynamite"
import { NinjaRope } from "../weapons/NinjaRope"
import { JetPack } from "../weapons/JetPack"
import { RayWeapon } from "../weapons/RayWeapon"
import { Shotgun } from "../weapons/Shotgun"
import { Minigun } from "../weapons/Minigun"
import { LandMine } from "../weapons/LandMine"
import { Blowtorch } from "../weapons/Blowtorch"
import { ProjectileWeapon } from "../weapons/ProjectileWeapon"


class WeaponManager
{

    private weaponsAndTools: BaseWeapon[];
    private currentWeaponIndex;

    constructor ()
    {
        this.weaponsAndTools = 
        [
            new Shotgun(99),           
            new HandGrenade(20),
            new HolyGrenade(2),
            new Dynamite(5),
           // new LandMine(10), //Not finished
            new JetPack(5), 
            new Minigun(4),   //Bug: might take out for final demo          
            new NinjaRope(50),
            new Drill(3),
           // new Blowtorch(3), //not finished
            new Bazzoka(15)
               
                       
        ];

        this.currentWeaponIndex = 1;
    }

 
    checkWeaponHasAmmo(weaponIndex: number)
    {
        if (this.weaponsAndTools[weaponIndex].ammo)
        {
            return true;
        }

        return false;
    }

    getCurrentWeapon()
    {
        return this.weaponsAndTools[this.currentWeaponIndex];
    }

    setCurrentWeapon(index: number)
    {
        //Allows the user to switch weapon once its active if its a jetpack or ninjia rope
        if (this.getCurrentWeapon().getIsActive() == false || this.getCurrentWeapon() instanceof JetPack || this.getCurrentWeapon() instanceof NinjaRope)
        {
            
            if (this.getCurrentWeapon() instanceof NinjaRope)
            {
                this.getCurrentWeapon().deactivate();
            }

            this.currentWeaponIndex = index;
        }
    }

    getListOfWeapons()
    {
        return this.weaponsAndTools;
    }


}