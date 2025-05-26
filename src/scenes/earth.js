import Player from '../modules/Player.js'
import Phaser from 'phaser'

export default class Earth extends Phaser.Scene{
  constructor(){
    super({
      key:"earth",
      physics: {
        arcade: {
          debug: false,
          gravity: {y: 550}
        }
      }
    });
  }
  PIXELS_PER_METER = 55;
  player;
        preload() {
          this.load.image('sky', require('@/assets/background.png'));
          this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
          this.load.image('goal', require('@/assets/goal.png')) ;
        }

        create() {
          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
          this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
          this.add.image(0, 0, 'sky')
            .setOrigin(0)
            .setDisplaySize(3000, this.scale.height)
            .setScrollFactor(1);
          this.goal = this.physics.add.staticImage(1400, 150, 'goal') // Crea una imagen de meta
          this.goal.setScale(0.5)
          this.player = new Player(this, 0, this.scale.height)
          this.input.keyboard.on('keydown-F', () => {
            if (!this.scale.isFullscreen) {
              this.scale.startFullscreen()
            } else {
              this.scale.stopFullscreen()
            }
          })

          // === Inputs HTML con DOM de Phaser ===

          // Ángulo
          this.angleInput = this.add.dom(this.scale.width / 2, 100).createFromHTML(`
            <input type="number" name="angle" value="45" placeholder="Angle"
                   style="width: 80px; padding: 4px; font-size: 16px;">
          `)

          // Velocidad
          this.velocityInput = this.add.dom(this.scale.width / 2, 150).createFromHTML(`
            <input type="number" name="velocity" value="450" placeholder="Velocity"
                   style="width: 80px; padding: 4px; font-size: 16px;">
          `)

          // Boton fire
          this.fireButton = this.add.dom(this.scale.width / 2, 200).createFromHTML(`
            <button style="padding: 6px 12px; font-size: 16px;">FIRE!</button>
          `)

          this.fireButton.addListener('click')
          this.fireButton.on('click', () => {
            const angleVal = parseFloat(this.angleInput.getChildByName('angle').value)
            const velocityVal = parseFloat(this.velocityInput.getChildByName('velocity').value)
            this.player.fire(angleVal,velocityVal)
          })

          this.angleInput.setOrigin(0.5)
          this.velocityInput.setOrigin(0.5)
          this.fireButton.setOrigin(0.5)
        }

        update() {
          this.player.update()
        }
}