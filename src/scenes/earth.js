import Player from '../modules/Player.js'
import Phaser from 'phaser'

export default class Earth extends Phaser.Scene{
  constructor(){
    super({
      key:"Earth",
      physics: {
        arcade: {
          debug: false,
        }
      }
    });
  }
  PIXELS_PER_METER = 40;
  gravity = 9.8
  player;
        preload() {
          this.load.image('sky', require('@/assets/background.png'));
          this.load.image('platform', require('@/assets/grass.png'));
          this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
          this.load.image('goal', require('@/assets/goal.png')) ;
          this.load.image('spikes', require('@/assets/spikes.png'))
        }

        create() {
          this.gravity = 9.8
          this.physics.world.gravity.y = (this.gravity * this.PIXELS_PER_METER);
          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
          this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
          this.add.image(0, 0, 'sky')
            .setOrigin(0)
            .setDisplaySize(3000, this.scale.height)
            .setScrollFactor(1);
          this.goal = this.physics.add.staticImage(500, 150, 'goal') // Crea una imagen de meta
          this.goal.setScale(0.5)
          this.player = new Player(this, 0, this.scale.height)

          // plataformas y obstaculos       
          this.obstacles = this.physics.add.staticGroup()

          this.obstacles.create(1000, 350, 'platform').setScale(1).refreshBody()

          // Detecta colisiones
          this.physics.add.collider(this.player.sprite, this.obstacles)

          const spikes = this.physics.add.staticImage(100, 400, 'spikes')
          spikes.setScale(0.04)
          spikes.refreshBody()
          spikes.body.setSize(15,27)

          this.physics.add.overlap(this.player.sprite, spikes, () => {
            this.scene.restart()
          })

          const graphics = this.add.graphics()
          graphics.lineStyle(2, 0xffffff)  // línea blanca

          // Dibuja la línea horizontal (regla)
          graphics.beginPath()
          graphics.moveTo(0, 650)
          graphics.lineTo(1504, 650)
          graphics.strokePath()

          // Dibuja las marcas cada 40 píxeles
          for (let x = 0; x <= 1504; x += 40) {
            graphics.moveTo(x, 650)
            graphics.lineTo(x, 640)
            graphics.strokePath()

            this.add.text(x, 655, `${x/this.PIXELS_PER_METER}`, {
              fontSize: '12px',
              color: '#ffffff'
            }).setOrigin(0.5, 0)  // centrar texto sobre la marca
          }

          // === Inputs HTML con DOM de Phaser ===

          // Ángulo
          this.angleInput = this.add.dom(this.scale.width / 2, 100).createFromHTML(`
            <input type="number" name="angle" value="45" placeholder="Angle"
                   style="width: 80px; padding: 4px; font-size: 16px;">
          `)

          // Velocidad
          this.velocityInput = this.add.dom(this.scale.width / 2, 150).createFromHTML(`
            <input type="number" name="velocity" value="10" placeholder="Velocity"
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