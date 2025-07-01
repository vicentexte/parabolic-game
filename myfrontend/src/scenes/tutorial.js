import Phaser from "phaser";
import start_button from "@/assets/sprites/interface/start_button.webp"

export default class Tutorial extends Phaser.Scene {
    constructor(){
        super({
            key:"Tutorial",
        });
    }

    preload(){
        this.load.image('start_button', start_button)
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
        this.circles.fillStyle(0xffffff);
        this.circles.fillCircle(actualscene.player.sprite.x, actualscene.player.sprite.y, 100);

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


        const text = this.add.text(this.scale.width/2,this.scale.height/2,"Este es tu personaje",style)

        // Función para actualizar la máscara al objetivo
        const fillGoal = () => {
            text.destroy()
            const text2 = this.add.text(this.scale.width/2,this.scale.height/2,'Utiliza el tablero \n para dispararlo y que \n llegue a la meta',style)
            this.circles.clear();
            this.circles.fillStyle(0xffffff);
            this.circles.fillCircle(actualscene.goal.sprite.x, actualscene.goal.sprite.y, 100);
            boton.destroy()
            const boton2 = this.add.image(400, 300, 'start_button')
            .setInteractive()
            .setScale(0.2);
            boton2.on('pointerdown', () => {
                this.scene.get("Interface").tutorialPassed = true
                text2.destroy()
                this.scene.stop()
            });
        };

        // Botón que activa el cambio
        const boton = this.add.image(400, 300, 'start_button')
            .setInteractive()
            .setScale(0.2);

        boton.on('pointerdown', () => {
            fillGoal();
        });
}



}