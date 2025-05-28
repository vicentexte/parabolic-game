import Player from '@/modules/Player'
import Phaser from 'phaser'
export default class Menu extends Phaser.Scene {
  constructor(){
    super({
      key:"Menu",
      physics: {
        arcade: {
          debug: false,
        }
      }
    });
  }
  autorizeTutorial = false

  preload() {
    this.load.image('sky', require('@/assets/background.png'))
    this.load.image('start', require('@/assets/startButton.png'))
    this.load.image('tutorial', require('@/assets/tutorialButton.png'))
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
  }

  create() {
    this.add.image(0, 0, 'sky')
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height)
    this.PIXELS_PER_METER = 40
    this.gravity = 9.8
    this.physics.world.gravity.y = 0;
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 80);
    this.add.image(0, 0, 'sky')
    .setOrigin(0)
    .setDisplaySize(this.scale.width, this.scale.height)
    .setScrollFactor(1);
    this.player = new Player(this,this.scale.width/2,this.scale.height/2)

    const startButton = this.add.sprite(this.scale.width/2,this.scale.height/2-200,'start').setScale(0.3).setInteractive()
    const tutorialButton = this.add.sprite(this.scale.width/2,this.scale.height/2,'tutorial').setScale(0.3).setInteractive()
    const group = this.add.group()
    group.add(startButton)
    group.add(tutorialButton)
    group.children.iterate((button) => {
      button.on('pointerover', () => {
        button.setTint(0x999999);
      });

      button.on('pointerout', () => {
        button.clearTint();
      });
    })
    
    tutorialButton.on('pointerdown', () => {
      this.physics.world.gravity.y = (this.gravity * this.PIXELS_PER_METER);
      this.add.text(tutorialButton.x,tutorialButton.y,
        "Ingresa un valor permitido de ángulo(°) y velocidad(m/s)\n" +
        "en el tablero de la izquierda de la pantalla y presiona\n" + 
        "FUEGO! para disparar al jugador.\n\n"+
        "*valor permitido: número entre -500 y 500 para la velocidad\n"+
        "y entre -360 y 360 para el ángulo.")
        .setColor("0xFFFFFF").setOrigin(0.5,0.5).setFontSize(23).setAlign("justify")
      this.autorizeTutorial = true;
      tutorialButton.destroy()
      this.time.delayedCall(200, () => {
        this.scene.launch('Inputs')
      })
      
    })

    startButton.on('pointerdown', () => { 
      this.scene.stop('Inputs')
      this.autorizeTutorial = false;
      this.time.delayedCall(200, () => {
        this.scene.start('Earth')
        this.scene.start('Interface')
      })
    })
  }

  update(){
    if (this.player) this.player.update()
  }
}
