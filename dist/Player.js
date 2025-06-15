// Import required modules
import { Team } from './Team';
import { Timer } from './system/Timer';
import { GamePad } from './system/GamePad';
import { Utils } from './system/Utils';
import { AssetManager } from './system/AssetManager';
import { Physics } from './system/Physics';
// Export Player class
export class Player {
    constructor(gameInstance, playerId = Utils.pickUnique([1, 2, 3, 4], 'playerids')) {
        this.gameInstance = gameInstance;
        if (!playerId) {
            throw ("Error Collecting playerId, undefined");
        }
        this.id = playerId;
        this.team = new Team(gameInstance, playerId);
        // Global keyup event listener
        window.addEventListener('keyup', (e) => {
            if (e.code === Controls.fire.keyboard) {
                const wormWeapon = this.team.getCurrentWorm().getWeapon();
                if (wormWeapon.getForceIndicator().isRequired() &&
                    wormWeapon.getForceIndicator().getForce() > 1 &&
                    !wormWeapon.getIsActive()) {
                    this.team.getCurrentWorm().fire();
                    Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain('fire'));
                    this.gameInstance.weaponMenu.refresh();
                }
            }
        });
        this.timer = new Timer(10);
        this.gamePad = new GamePad();
    }
    getPlayerNetData() {
        return this.team.getTeamNetData();
    }
    setPlayerNetData(data) {
        this.team.setTeamNetData(data);
    }
    getTeam() {
        return this.team;
    }
    weaponFireOrCharge() {
        const wormWeapon = this.team.getCurrentWorm().getWeapon();
        if (wormWeapon.getForceIndicator().isRequired() &&
            !wormWeapon.getIsActive()) {
            if (wormWeapon.ammo > 0 && wormWeapon.getForceIndicator().charge(3)) {
                this.team.getCurrentWorm().fire();
                this.gameInstance.weaponMenu.refresh();
            }
            else if (wormWeapon.ammo <= 0) {
                Notify.display('Out of Ammo', `No more ammo left in your ${wormWeapon.name}. Select a new weapon.`, 5000);
                AssetManager.getSound('cantclickhere').play();
            }
        }
        else {
            this.team.getCurrentWorm().fire();
            this.gameInstance.weaponMenu.refresh();
        }
    }
    update() {
        this.timer.update();
        this.gamePad.connect();
        this.gamePad.update();
        const onlineSpecific = Client.isClientsTurn();
        if (onlineSpecific &&
            this.gameInstance.state.getCurrentPlayer() === this &&
            !this.gameInstance.state.hasNextTurnBeenTiggered()) {
            // Player controls
            if (keyboard.isKeyDown(Controls.jump.keyboard, true) ||
                this.gamePad.isButtonPressed(0) ||
                TouchUI.isJumpDown(true)) {
                this.team.getCurrentWorm().jump();
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain('jump'));
            }
            if (keyboard.isKeyDown(Controls.backFlip.keyboard, true) ||
                this.gamePad.isButtonPressed(0)) {
                this.team.getCurrentWorm().backFlip();
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain('backFlip'));
            }
            if (keyboard.isKeyDown(Controls.walkLeft.keyboard) ||
                this.gamePad.isButtonPressed(14) ||
                this.gamePad.getAxis(0) == false ? false : this.gamePad.getAxis(0) > 0.5 ||
                this.gameInstance.sticks.getNormal(0).x < -0.5) {
                this.team.getCurrentWorm().walkLeft();
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain('walkLeft'));
            }
            if (keyboard.isKeyDown(Controls.walkRight.keyboard) ||
                this.gamePad.isButtonPressed(15) ||
                this.gamePad.getAxis(1) == false ? false : this.gamePad.getAxis(1) > 0.5 ||
                this.gameInstance.sticks.getNormal(0).x > 0.5) {
                this.team.getCurrentWorm().walkRight();
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain('walkRight'));
            }
            if (keyboard.isKeyDown(Controls.aimUp.keyboard) ||
                this.gamePad.getAxis(2) == false ? false : this.gamePad.getAxis(2) >= 0.2 ||
                this.gamePad.getAxis(3) == false ? false : this.gamePad.getAxis(3) >= 0.2 ||
                this.gameInstance.sticks.getNormal(0).y < -0.6) {
                const currentWorm = this.team.getCurrentWorm();
                currentWorm.target.aim(-0.8);
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain('target.aim', [-0.8]));
            }
            if (keyboard.isKeyDown(Controls.aimDown.keyboard) ||
                this.gamePad.getAxis(2) == false ? false : this.gamePad.getAxis(1) <= -0.2 ||
                this.gamePad.getAxis(3) == false ? false : this.gamePad.getAxis(1) <= -0.2 ||
                this.gameInstance.sticks.getNormal(0).y > 0.6) {
                const currentWorm = this.team.getCurrentWorm();
                currentWorm.target.aim(0.8);
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain('target.aim', [0.8]));
            }
            if (keyboard.isKeyDown(Controls.fire.keyboard, true) ||
                this.gamePad.isButtonPressed(7) ||
                TouchUI.isFireButtonDown()) {
                this.weaponFireOrCharge();
                Client.sendImmediately(Events.client.ACTION, new InstructionChain('state.getCurrentPlayer.weaponFireOrCharge'));
            }
            else if (TouchUI.isTouchDevice()) {
                const wormWeapon = this.team.getCurrentWorm().getWeapon();
                if (!TouchUI.isFireButtonDown() &&
                    wormWeapon.getForceIndicator().isRequired() &&
                    wormWeapon.getForceIndicator().getForce() > 5 &&
                    !wormWeapon.getIsActive()) {
                    this.team.getCurrentWorm().fire();
                    Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain('fire'));
                    this.gameInstance.weaponMenu.refresh();
                }
            }
        }
        // Camera logic
        const fastestWorm = this.gameInstance.wormManager.findFastestMovingWorm();
        if (this.gameInstance.state.physicsWorldSettled &&
            fastestWorm !== null &&
            fastestWorm.body.GetLinearVelocity().Length() > 3) {
            this.gameInstance.camera.panToPosition(Physics.vectorMetersToPixels(fastestWorm.body.GetPosition()));
        }
        if (!this.gameInstance.state.hasNextTurnBeenTiggered()) {
            if (keyboard.isKeyDown(38)) {
                this.gameInstance.camera.cancelPan();
                this.gameInstance.camera.incrementY(-15);
            }
            if (keyboard.isKeyDown(40)) {
                this.gameInstance.camera.cancelPan();
                this.gameInstance.camera.incrementY(15);
            }
            if (keyboard.isKeyDown(37)) {
                this.gameInstance.camera.cancelPan();
                this.gameInstance.camera.incrementX(-15);
            }
            if (keyboard.isKeyDown(39)) {
                this.gameInstance.camera.cancelPan();
                this.gameInstance.camera.incrementX(15);
            }
            const currentWorm = this.team.getCurrentWorm();
            if (this.gameInstance.state.physicsWorldSettled &&
                currentWorm.body.GetLinearVelocity().Length() >= 0.1) {
                this.gameInstance.camera.panToPosition(Physics.vectorMetersToPixels(currentWorm.body.GetPosition()));
            }
            else if (this.gameInstance.state.physicsWorldSettled &&
                (this.team.getWeaponManager().getCurrentWeapon() instanceof ThrowableWeapon ||
                    this.team.getWeaponManager().getCurrentWeapon() instanceof ProjectileWeapon) &&
                this.team.getWeaponManager().getCurrentWeapon().getIsActive()) {
                const weapon = this.team.getWeaponManager().getCurrentWeapon();
                this.gameInstance.camera.panToPosition(Physics.vectorMetersToPixels(weapon.body.GetPosition()));
            }
        }
        this.team.update();
    }
    draw(ctx) {
        this.team.draw(ctx);
    }
}
// Optional: If needed elsewhere, export PlayerDataPacket
export class PlayerDataPacket {
    constructor(player) {
        this.teamDataPacket = new TeamDataPacket(player.getTeam());
    }
    override(player) {
        this.teamDataPacket.override(player.getTeam());
    }
}
