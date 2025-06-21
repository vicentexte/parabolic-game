import Phaser from "phaser";

//assets
import background from '@/assets/sprites/backgrounds/earth_bg.webp'
import dom_bg from '@/assets/sprites/interface/dom_bg.webp'
import back_button from '@/assets/sprites/interface/back_button.webp'

//html
import score_html from '@/html/score_table.html'

//modules
import Button from "@/modules/button";

export default class Scores extends Phaser.Scene {

    constructor() {
        super({ key: "Score" });
    }

    preload() {
        this.load.image('menu_bg', background);
        this.load.image('back_button', back_button);
    }

    create() {
        this.add.image(0, 0, 'menu_bg')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height);

        this.back_button = new Button(this, 0, 0, 'back_button');

        const dom_x = 600;
        const dom_y = 200;
        const domElement = this.add.dom(dom_x, dom_y).createFromHTML(score_html.replace('{{dom_bg}}', dom_bg));

        this.time.delayedCall(50, async () => {
            const tabla = domElement.getChildByID("tabla-puntajes");
            const tbody = tabla.querySelector("tbody");

            try {
                const response = await fetch("http://localhost:3000/api/scores");
                const data = await response.json();

                data.forEach(d => {
                    const fila = document.createElement("tr");
                    const fecha = new Date(d.fecha).toLocaleDateString();
                    fila.innerHTML = `<td>${d.jugador}</td><td>${d.puntos}</td><td>${fecha}</td>`;
                    tbody.appendChild(fila);
                });
            } catch (error) {
                console.error("Error al obtener puntuaciones:", error);
            }
        });
    }
}
