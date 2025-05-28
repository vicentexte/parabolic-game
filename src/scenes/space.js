import Player from '../modules/Player.js'
import Phaser from 'phaser'

export default class Space extends Phaser.Scene{
  constructor(){
    super({
      key:"Space",
      physics: {
        arcade: {
          debug: true,
        }
      }
    });
  }
  PIXELS_PER_METER = 40;
  gravity = 1.6
  player;
        preload() {
            this.load.image('space', require('@/assets/luna.jpg'));
            this.load.image('platform', require('@/assets/grass.png'));
            this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
            this.load.image('goal', require('@/assets/goal.png'));
            this.load.image('spikes', require('@/assets/spikes.png'));
            this.load.audio('music', require('@/assets/music.mp3'));
        }

        create() {
          this.music = this.sound.add('music',{loop: true, volume: 0.2})
          this.music.play()
          this.physics.world.gravity.y = (this.gravity * this.PIXELS_PER_METER);
          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 80);
          this.add.image(0, 0, 'space')
            .setOrigin(0)
            .setDisplaySize(3000, this.scale.height)
            .setScrollFactor(1);

          this.goal = this.physics.add.staticImage(500, 150, 'goal') // Crea una imagen de meta
          this.goal.setScale(0.5)
          this.goal.body.setSize(
          this.goal.displayWidth * 0.2, // ancho más pequeño (20% del ancho visible)
          this.goal.displayHeight * 0.65, // alto más pequeño (40% del alto visible)
          false
          )
          // Centrar el cuerpo en el sprite
          this.goal.body.setOffset(
            (this.goal.displayWidth - this.goal.body.width) ,
            (this.goal.displayHeight - this.goal.body.height + 19) 
          )
          this.player = new Player(this, 0, this.scale.height)

          // plataformas y obstaculos       
          this.obstacles = this.physics.add.staticGroup()

          this.obstacles.create(1000, 350, 'platform').setScale(1).refreshBody()

          // Detecta colisiones
          this.physics.add.collider(this.player.sprite, this.obstacles)

          this.spikes = this.physics.add.staticImage(100, 400, 'spikes')
            .setScale(0.04)
            .refreshBody()
            .body.setSize(15,27)

          this.physics.add.overlap(this.player.sprite, this.spikes, () => {
            this.scene.restart()
            this.music.destroy()
          })

          this.physics.add.overlap(this.player.sprite, this.goal, () => {
            this.scene.start('Menu')
            this.music.destroy()
          })

          this.graphics = this.add.graphics()
          this.graphics.lineStyle(2, 0xffffff)  // línea blanca

          // Dibuja la línea horizontal (regla)
          this.graphics.beginPath()
          this.graphics.moveTo(0, 650)
          this.graphics.lineTo(1504, 650)
          this.graphics.strokePath()

          // Dibuja las marcas cada 40 píxeles
          for (let x = 0; x <= 1504; x += 40) {
            this.graphics.moveTo(x, 650)
            this.graphics.lineTo(x, 640)
            this.graphics.strokePath()

            this.add.text(x, 655, `${x/this.PIXELS_PER_METER}`, {
              fontSize: '12px',
              color: '#ffffff'
            }).setOrigin(0.5, 0)  // centrar texto sobre la marca
          }
        }

        update() {
          this.player.update()
        }
}