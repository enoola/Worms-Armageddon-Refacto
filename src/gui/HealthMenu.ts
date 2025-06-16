import { Settings } from "@/Settings";
import { Game } from "@/Game";
import { Team } from "@/Team"; // Assuming Team class exists in Team.ts
import $ from "jquery";

export class HealthMenu {
    constructor(private players: Record<string, { getTeam(): Team }>) {
        let html = "";

        // Use Object.entries for clearer iteration
        for (const [key, player] of Object.entries(players)) {
            const team: Team = player.getTeam();

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

    show(): void {
        $('.healthMenu').show();
    }

    hide(): void {
        $('.healthMenu').hide();
    }

    update(teamRef: Team): void {
        $(`#${teamRef.teamId}`).animate({
            width: `${teamRef.getPercentageHealth()}%`
        }, 300);
    }
}