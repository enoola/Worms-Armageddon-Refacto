/**
 * @update
 Feature,Before,After
  Module system,Triple-slash references,ES Module imports
 DOM manipulation,jQuery ($),Native DOM APIs
Event handling,jQuery .click", ".keypress", etc.",Native addEventListener
Animations,jQuery .animate(),CSS + JS transition control
Typing,Untyped variables,Full TypeScript typing
Code structure,Legacy style,Modern OOP + encapsulation
 */
import { Controls } from '../system/Controls';
import { Client } from '../networking/Client';
import { Events } from '../events/Events';
import { InstructionChain } from '../networking/InstructionChain';
import { AssetManager } from '../system/AssetManager';
export class WeaponsMenu {
    constructor(gameInstance) {
        this.cssId = 'weaponsMenu';
        this.toggleButtonCssId = 'weaponsMenuBtn';
        this.isVisible = false;
        this.gameInstance = gameInstance;
        // Create and append the menu HTML
        const menuHTML = `
            <div id="${this.cssId}">
                <div id="${this.toggleButtonCssId}">Weapons Menu</div>
                <div id="content"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', menuHTML);
        this.htmlElement = document.getElementById(this.cssId);
        // Toggle button click handler
        const toggleButton = document.getElementById(this.toggleButtonCssId);
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                if (Client.isClientsTurn()) {
                    this.toggle();
                }
            });
        }
        // Keyboard shortcut for toggling
        window.addEventListener('keypress', (event) => {
            if (Client.isClientsTurn() && Controls.checkControls(Controls.toggleWeaponMenu, event.key)) {
                this.toggle();
            }
        });
        // Prevent context menu on right-click inside the menu
        this.htmlElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        // Optional: mousedown outside the menu (if needed)
        document.body.addEventListener('mousedown', (event) => {
            if (Client.isClientsTurn() &&
                event.target.matches(`[data-toggle-weapon-menu]`)) {
                this.toggle();
            }
        });
    }
    selectWeapon(weaponId) {
        const weaponMgmt = this.gameInstance.state.getCurrentPlayer().getTeam().getWeaponManager();
        if (weaponMgmt.checkWeaponHasAmmo(weaponId)) {
            weaponMgmt.setCurrentWeapon(weaponId);
            Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayer.getTeam.getWeaponManager.setCurrentWeapon", [weaponId]));
        }
    }
    show() {
        this.htmlElement.style.display = 'block';
    }
    refresh() {
        const weaponMgmt = GameInstance.state.getCurrentPlayer().getTeam().getWeaponManager();
        this.populateMenu(weaponMgmt.getListOfWeapons());
    }
    toggle() {
        this.refresh();
        let moveAmountInPx = '0px';
        if (!this.isVisible) {
            moveAmountInPx = '-275px';
            this.isVisible = true;
        }
        else {
            this.isVisible = false;
        }
        // Animate using CSS transitions instead of jQuery.animate()
        this.htmlElement.style.transition = 'margin-left 400ms ease-in-out';
        this.htmlElement.style.marginLeft = moveAmountInPx;
    }
    populateMenu(listOfWeapons) {
        let html = '<ul class="thumbnails">';
        for (const weapon of listOfWeapons) {
            const weaponId = weapon.id; // assuming each weapon has an ID
            let cssClassType = 'ammo';
            if (weapon.ammo <= 0) {
                cssClassType = 'noAmmo';
            }
            html += `
                <li class="span1" id="${weaponId}">
                    <a class="thumbnail ${cssClassType}" id="${weaponId}" title="${weapon.name}">
                        <span class="ammoCount">${weapon.ammo}</span>
                        <img src="${weapon.iconImage.src}" alt="${weapon.name}" title="${weapon.name}" />
                    </a>
                </li>`;
        }
        html += '</ul>';
        const contentContainer = this.htmlElement.querySelector('#content');
        if (contentContainer) {
            contentContainer.innerHTML = '';
            contentContainer.insertAdjacentHTML('beforeend', html);
        }
        // Attach click handlers
        const listItems = this.htmlElement.querySelectorAll('#content li');
        listItems.forEach((li) => {
            li.addEventListener('click', () => {
                const weaponId = parseInt(li.getAttribute('id') || '-1');
                if (weaponId === -1) {
                    AssetManager.getSound('cantclickhere').play();
                    return;
                }
                AssetManager.getSound('CursorSelect').play();
                this.selectWeapon(weaponId);
                this.toggle();
            });
        });
    }
}
