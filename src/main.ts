import { Physics } from "./system/Physics";
import { Team } from "./Team";
import { Worm } from "./Worm";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

Physics.initWorld();

const team = new Team("Red", "#ff0000");
const worm = new Worm(team, 100, 100);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    worm.update();
    worm.draw(ctx);
    requestAnimationFrame(gameLoop);
}

gameLoop();