import Phaser from "phaser";
import next_button from "@/assets/sprites/interface/next_button.webp"
import Button from "@/modules/button";
import dom_image from "@/assets/sprites/interface/dom_image.webp"

export default class Tutorial extends Phaser.Scene {
    constructor(){
        super({
            key:"Tutorial",
        });
    }
functionSelect = 1
    preload(){
        this.load.image('next_button', next_button)
        this.load.image('dom_image', dom_image)
    }

    create() {
        const actualscene = this.scene.manager.getScenes()[0];

        // Fondo transparente que bloquea todo
        const blocker = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x000000,
            0
        );
        blocker.setInteractive(); // captura eventos
        blocker.on('pointerdown', () => {
            // nada: solo bloquea clicks debajo
        });

        // Fondo negro translúcido
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.8);
        bg.fillRect(0, 0, this.scale.width, this.scale.height);

        // Gráfica para la máscara de agujero
        this.circles = this.make.graphics({ x: 0, y: 0, add: false });

        // Crear máscara e invertirla
        const mask = this.circles.createGeometryMask();
        mask.invertAlpha = true;
        bg.setMask(mask);

        const style = {
            fontSize: '44px',
            color: '#E9A02B',
            fontStyle: 'bold',
            align: 'center'
        };

        this.functions = [
            () => {
                this.text = this.add.text(this.scale.width/2,this.scale.height/2,"Este es tu personaje",style)
                this.circles.fillStyle(0xffffff);
                this.circles.fillCircle(actualscene.player.sprite.x, actualscene.player.sprite.y, 100);
            },
            () => {
                this.dom_sprite = this.add.image(this.scale.width/2-200,this.scale.height/2,'dom_image')
                this.text.destroy()
                this.text2 = this.add.text(this.scale.width/2,this.scale.height/2,'Utiliza el tablero \n para dispararlo y que \n llegue a la meta',style)
                this.circles.clear();
                this.circles.fillStyle(0xffffff);
                this.circles.fillCircle(actualscene.goal.sprite.x, actualscene.goal.sprite.y, 100);
            },
            () => {
                this.dom_sprite.destroy()
                this.text2.destroy()
                this.text3 = this.add.text(this.scale.width/2,this.scale.height/2,'Solo tienes 3 intentos',style)
                this.circles.clear();
                this.circles.fillStyle(0xffffff);
                this.circles.fillCircle(this.scene.get('Interface').lifeIcon.x + 20, this.scene.get('Interface').lifeIcon.y + 20, 75);
            },
            () => {
                this.text3.destroy()
                this.text3 = this.add.text(this.scale.width/2,this.scale.height/2,'Recolecta monedas para \n más puntuación',style)
                this.circles.clear();
                this.circles.fillStyle(0xffffff);
                this.circles.fillCircle(this.scene.get('Interface').coinIcon.x + 35, this.scene.get('Interface').coinIcon.y + 35, 100);
            },
            () => {             
                this.scene.get("Interface").tutorialPassed = true
                this.scene.stop()
            }
        ]

        new Button(this, this.scale.width - 100, this.scale.height - 500, 'next_button')

        this.functions[0]()
    }



}