import Phaser from "phaser";

//assets
import background from '@/assets/sprites/backgrounds/earth_bg.webp'
import dom_bg from '@/assets/sprites/interface/dom_bg.webp'
import back_button from '@/assets/sprites/interface/back_button.webp'

//data
import scores from '@/assets/data/scores.json'

//html
import score_html from '@/html/score_table.html'

//modules
import Button from "@/modules/button";

export default class Scores extends Phaser.Scene{

    constructor(){
        super({
        key:"Score"
        });
    }

    preload(){
        this.load.image('menu_bg',background)
        this.load.image('back_button',back_button)
    }

    create(){
        this.add.image(0,0,'menu_bg')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)

        this.back_button = new Button(this,0,0,'back_button')

        const dom_x = 600
        const dom_y = 200
        const domElement = this.add.dom(dom_x,dom_y).createFromHTML(score_html.replace('{{dom_bg}}',dom_bg))

        this.time.delayedCall(50, () => {
            const tabla = domElement.getChildByID("tabla-puntajes");
            const tbody = tabla.querySelector("tbody");

            scores.elements.forEach(d => {
                const fila = document.createElement("tr");
                fila.innerHTML = `<td>${d.name}</td><td>${d.score}</td><td>${d.date}</td>`;
                tbody.appendChild(fila);
                });
        }); 

    }
}