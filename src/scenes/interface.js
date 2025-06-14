import Phaser, { NONE } from 'phaser';

//import assets
import menu_button from '@/assets/sprites/interface/menu_button.webp'
import pause_button from '@/assets/sprites/interface/pause_button.webp'
import restart_button from '@/assets/sprites/interface/restart_button.webp'
//import music and sfx
import earth_music from '@/assets/sounds/music/earth_music.ogg'
import space_music from '@/assets/sounds/music/space_music.ogg'
//import modules
import Button from '@/modules/button';


export default class Interface extends Phaser.Scene{
  constructor(){
    super({
      key:"Interface"
      });
  }

  //Variables for coins statistics

  preload(){
    this.load.image('menu_button', menu_button)
    this.load.image('pause_button', pause_button) 
    this.load.image('restart_button', restart_button)
    this.load.audio('earth_music', earth_music)
    this.load.audio('space_music', space_music)
  }

  create(){
    // Set up the music ***Agregar diferentes tipos de música para cada escena***
    this.actualScene = this.scene.manager.getScenes()[0]
    this.music_foreach = ['earth_music','space_music']

    this.sound.get(this.actual_music)==null? 
    this.music = this.sound.add(this.actual_music,{loop: true, volume: 0.2}):
    this.music = this.sound.get(this.actual_music); 

    !this.sound.isPlaying(this.actual_music)? this.music.play(): NONE //Averiguar si NONE está correcto

    //Set up options buttons
    new Button(this, 0, 0, 'interface_buttons')

    // Set up the coins system
    var ypos = this.textures.getFrame('menu_button').height * 0.15
    this.coinsCollected = 0;
    this.coinIcon = this.add.image(0, ypos + 10, 'coin')
      .setOrigin(0,0)
      .setScale(0.05)
      .setScrollFactor(0);
    this.coinText = this.add.text(68, this.coinIcon.y, 'x0',{
      fontFamily: 'Courier New',
      fontSize: '34px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 0,
        fill: true
      }
    })
  }

  //Function to collect coins
  collectCoin(player, coin){
    coin.disableBody(true, true);
    this.coinsCollected++;
    this.coinText.setText('x' + this.coinsCollected)
  }

  //Function to handle the end of the level
  handleLevelEnd(){
    const jumps = this.actualScene.player.jumpCount;
    let stars = 0;

    if (jumps === 1) {
      stars = 3;
    } else if (jumps === 2) {
      stars = 2;
    } else {
      stars = 0;
    }

    const starText = stars === 0 ? '❌ No stars' : '⭐'.repeat(stars);
    const finalText = this.add.text(this.actualScene.scale.width / 2, this.actualScene.scale.height / 2, starText, {
      fontSize: '40px',
      color: '#fff',
      fontFamily: 'Arial',
      backgroundColor: '#000'
    }).setOrigin(0.5)
    this.time.delayedCall(2000,() => {

      finalText.destroy()
    })
  }

  update(){
    //Check if the Inputs scene is active, if not, launch it just in case the player can fire
    if (this.actualScene.player){
      if (!this.scene.isActive('Inputs') && this.actualScene.player.canFire == true){
        this.scene.launch('Inputs')
      }
    }
    
    if (this.scene.manager.getScenes()[0] != this){
      this.actualScene = this.scene.manager.getScenes()[0]
    }

    // If the current scene is the menu_button, stop the Interface scene and destroy the music
    if (this.scene.isActive('Menu')){
        this.scene.stop()
        this.music.destroy()
    }
  }
}