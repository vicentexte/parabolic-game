import Phaser from 'phaser';
export default class Interface extends Phaser.Scene{
  constructor(){
    super({
      key:"Interface",
      physics: {
        arcade: {
          debug: true,
        }
      }
    });
  }
  preload(){
    this.load.image('menu', require('@/assets/menu.png'));
    this.load.image('pause', require('@/assets/pause.png'));
    this.load.image('restart', require('@/assets/restart.png'));
  }
  create(){
    //menu de opciones
    const menu_scale = 0.15
    this.menu = this.physics.add.staticImage(0, 0, 'menu').setScale(menu_scale).setOrigin(0,0).setInteractive()
    this.pause = this.physics.add.staticImage(0, 0, 'pause').setScale(menu_scale).setOrigin(0,0).setInteractive()
    this.restart = this.physics.add.staticImage(0, 0, 'restart').setScale(menu_scale).setOrigin(0,0).setInteractive()
    const menux_position = this.scale.width - this.menu.displayWidth * 5
    const menuy_position = 0

    this.menu.x = menux_position
    this.menu.y = menuy_position 
    this.menu.refreshBody()

    this.pause.x = menux_position + this.menu.displayWidth + this.menu.displayWidth/2
    this.pause.y = menuy_position  
    this.pause.refreshBody()

    this.restart.x = menux_position + this.menu.displayWidth*2 + this.menu.displayWidth
    this.restart.y = menuy_position 
    this.restart.refreshBody()

    this.actualScene = this.scene.manager.getScenes()[0];

    this.menu.on('pointerdown', () => {
        this.actualScene.scene.start('Menu'); 
        this.actualScene.music.destroy();
    })
    this.pause.on('pointerdown', () => {
        if (!this.actualScene.scene.isPaused()){
            this.actualScene.scene.pause(); this.actualScene.music.pause()
        } else {
            this.actualScene.scene.resume(); this.actualScene.music.resume()
        }
    })
    this.restart.on('pointerdown', () => {this.actualScene.scene.restart(); this.actualScene.music.destroy()})
  }
  update(){
    this.time.delayedCall(100, () => {
        if (!this.scene.isActive('Inputs') && this.actualScene.player.canFire == true){
            this.scene.launch('Inputs')
        }
    })

    if (this.scene.manager.getScenes()[0] != this){
        this.actualScene = this.scene.manager.getScenes()[0];
    }
    if (this.scene.isActive('Menu')){
        this.scene.stop()
    }
  }
}