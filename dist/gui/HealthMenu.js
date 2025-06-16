import { Settings } from "@/Settings";
import $ from "jquery";
export class HealthMenu {
    constructor(players) {
        this.players = players;
        let html = "";
        // Use Object.entries for clearer iteration
        for (const [key, player] of Object.entries(players)) {
            const team = player.getTeam();
            html += `
                <li>
                    <span>${team.name}</span>
                    <img src="${Settings.REMOTE_ASSERT_SERVER}data/images/Ireland.png">
                    <span 
                        id="${team.teamId}" 
                        class="health" 
                        style="width: ${team.getPercentageHealth()}%; background: ${team.color}"
                    ></span>
                </li>`;
        }
        $('.healthMenu').html(html);
        this.hide();
    }
    show() {
        $('.healthMenu').show();
    }
    hide() {
        $('.healthMenu').hide();
    }
    update(teamRef) {
        $(`#${teamRef.teamId}`).animate({
            width: `${teamRef.getPercentageHealth()}%`
        }, 300);
    }
}
