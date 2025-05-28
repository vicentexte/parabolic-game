import Phaser from 'phaser'
export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  preload() {
    this.load.image('sky', require('@/assets/background.png'))
  }

  create() {
    this.add.image(0, 0, 'sky')
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height)

    this.add.text(this.scale.width / 2, 200, '¡Bienvenido!', {
      fontSize: '48px',
      color: '#fff'
    }).setOrigin(0.5)

    const startButton = this.add.text(this.scale.width / 2, 300, 'Iniciar juego', {
      fontSize: '32px',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive()

    startButton.on('pointerdown', () => {
      this.scene.start('Earth')
      this.scene.start('Interface')
    })
  }
}
