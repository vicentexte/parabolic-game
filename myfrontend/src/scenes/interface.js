import Phaser, { NONE } from 'phaser';

//import assets
import menu_button from '@/assets/sprites/interface/menu_button.webp'
import pause_button from '@/assets/sprites/interface/pause_button.webp'
import restart_button from '@/assets/sprites/interface/restart_button.webp'
import arrow_pointer from '@/assets/sprites/interface/arrow_pointer.webp'
import arrow_head from '@/assets/sprites/interface/arrow_head.webp'
//import music and sfx
import earth_music from '@/assets/sounds/music/earth_music.ogg'
import space_music from '@/assets/sounds/music/space_music.ogg'
import coin_sfx from '@/assets/sounds/sfx/coin_pickup.ogg'
import level_completed_sfx from '@/assets/sounds/sfx/level_completed.ogg'
//import modules
import Button from '@/modules/button';
import ArrowPointer from '@/modules/arrow_pointer';


export default class Interface extends Phaser.Scene{
  constructor(){
    super({
      key:"Interface"
      });
  }

  //Variables for coins statistics
    tutorialPassed = false
 
  preload(){
    this.load.image('menu_button', menu_button)
    this.load.image('pause_button', pause_button) 
    this.load.image('restart_button', restart_button)
    this.load.image('arrow_pointer', arrow_pointer)
    this.load.image('arrow_head', arrow_head)
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');

    this.load.audio('earth_music', earth_music)
    this.load.audio('space_music', space_music)

    this.load.audio('coin_sfx',coin_sfx)
    this.load.audio('level_completed_sfx',level_completed_sfx)
  }

  create(){

    this.lifes = 3
    this.passed = false
    //score count
    this.score = 0

    //Set the playable scenes
    this.levelScenes=['Earth','Space']

    // Set up the music ***Agregar diferentes tipos de música para cada escena***
    this.actualScene = this.scene.manager.getScenes()[0]
    this.music_foreach = ['earth_music','space_music']
    this.actual_music = this.music_foreach[this.actualScene.level-1]

    this.sound.get(this.actual_music)==null? 
    this.music = this.sound.add(this.actual_music,{loop: true, volume: 0.2}):
    this.music = this.sound.get(this.actual_music); 

    !this.sound.isPlaying(this.actual_music)? this.music.play(): NONE //Averiguar si NONE está correcto

    //Arrow pointer
    this.arrow_pointer = new ArrowPointer(this,'arrow_pointer','arrow_head') 

    //Set up options buttons
    new Button(this, 0, 0, 'interface_buttons')

    // Set up the coins system
    var style = {
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
    }
    var ypos = this.textures.getFrame('menu_button').height * 0.15
    this.coinsCollected = 0;
    this.coinIcon = this.add.image(0, ypos + 10, 'coin')
      .setOrigin(0,0)
      .setScale(0.05)
      .setScrollFactor(0);
    this.coinText = this.add.text(68, this.coinIcon.y, 'x0', style)

    this.lifeIcon = this.add.image(20, this.coinIcon.y + this.coinIcon.displayHeight + 10, 'player')
      .setOrigin(0,0)
      .setScrollFactor(0);
    this.lifeText = this.add.text(68, this.lifeIcon.y, 'x' + this.lifes, style)
  }

  //Function to collect coins
  collectCoin(player, coin){
    this.coin_sfx == undefined?
    this.coin_sfx = this.sound.add('coin_sfx',{loop: false, volume: 0.8}):true
    this.coin_sfx.play()
    coin.disableBody(true, true);
    this.coinsCollected++;
    this.coinText.setText('x' + this.coinsCollected)
    this.score += 2
  }

  //Function to handle the end of the level, Count the amount of stars and show there, the handle the music and level transition
  handleLevelEnd(){
    this.level_completed_sfx == undefined?
    this.level_completed_sfx = this.sound.add('level_completed_sfx',{loop: false, volume: 0.8}):true
    this.level_completed_sfx.play()
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
    this.score += stars
    const finalText = this.add.text(this.actualScene.scale.width / 2, this.actualScene.scale.height / 2, starText, {
      fontSize: '40px',
      color: '#fff',
      fontFamily: 'Arial',
      backgroundColor: '#000'
    }).setOrigin(0.5)
    //Level and music transition
      this.time.delayedCall(2000,() => {
        finalText.destroy()
        this.music.stop()
        if (this.lifes>0){
          if (this.levelScenes[this.actualScene.level] != undefined){
            this.actualScene.scene.start(this.levelScenes[this.actualScene.level])
            this.actual_music = this.music_foreach[this.actualScene.level] //here is not -1 because we need the next song
            this.sound.get(this.actual_music)==null?
            this.music = this.sound.add(this.actual_music,{loop: true, volume: 0.2}):
            this.music = this.sound.get(this.actual_music)
            this.music.play()
          } else {
            this.lifes = 3
            this.actualScene.scene.start('EndGame')

          }
      } else {
        this.lifes = 3
        this.actualScene.scene.start('EndGame')
      }
    })
  }

  update(){
    

    //Run arrow_pointer's update function
    this.arrow_pointer.update()

    //Check if the Inputs scene is active, if not, launch it just in case the player can fire
    if (this.actualScene.player){
      if (this.lifes == 0 && this.actualScene.player.canFire==true) {
        this.actualScene.scene.pause()
        this.handleLevelEnd()
      }

      if (!this.scene.isActive('Inputs') && this.actualScene.player.canFire == true && !this.scene.isActive('Tutorial')){
        
        this.scene.launch('Inputs')
      }
      this.lifeText.setText('x' + this.lifes)
      if(this.actualScene.player.fired == true && this.actualScene.player.canFire == true && this.passed==false){
        this.actualScene.player.fired = false
        this.lifes -= 1
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