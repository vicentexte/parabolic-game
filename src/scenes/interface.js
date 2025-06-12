import Phaser from 'phaser';

//import assets
import menu_button from '@/assets/Sprites/Interface/menu_button.webp'
import pause_button from '@/assets/Sprites/Interface/pause_button.webp'
import restart_button from '@/assets/Sprites/Interface/restart_button.webp'
//import music and sfx
import level_music from '@/assets/Sounds/Music/earth_music.ogg'
import click from '@/assets/Sounds/SFX/click.ogg'


export default class Interface extends Phaser.Scene{
  constructor(){
    super({
      key:"Interface"
      });
  }

  //Variables for coins statistics
  coinsCollected;
  coinText;
  
  preload(){
    this.load.image('menu_button', menu_button)
    this.load.image('pause_button', pause_button) 
    this.load.image('restart_button', restart_button)
    this.load.audio('earth_music', level_music)
    this.load.audio('click', click)
  }

  create(){
    // Set up the music ***Agregar diferentes tipos de música para cada escena***
    var click_sfx
    if (this.sound.get('click')==null) {
      click_sfx = this.sound.add('click', {loop:false, volume: 1});
    } else {
      click_sfx = this.sound.get('click');
    }
    if (this.sound.get('earth_music')==null) {
      this.music = this.sound.add('earth_music',{loop: true, volume: 0.2})
    } else {
      this.music = this.sound.get('earth_music');
    }

    if (!this.sound.isPlaying('earth_music')) {
      this.music.play();
    }

    //Set up options buttons
    const buttons_scale = 0.15

    const menu_button = this.add.image(0, 0, 'menu_button').setScale(buttons_scale).setOrigin(0,0).setInteractive()
    const pause_button = this.add.image(0, 0, 'pause_button').setScale(buttons_scale).setOrigin(0,0).setInteractive()
    const restart_button = this.add.image(0, 0, 'restart_button').setScale(buttons_scale).setOrigin(0,0).setInteractive()

    const buttonsGroup = this.add.group()
    buttonsGroup.add(menu_button)
    buttonsGroup.add(pause_button)
    buttonsGroup.add(restart_button)

    //Set the position of the menu_button and buttons
    const menu_buttonWidth = menu_button.displayWidth
    const menu_buttonx_position = this.scale.width - menu_buttonWidth * 5
    const menu_buttony_position = 0

    menu_button.x = menu_buttonx_position
    menu_button.y = menu_buttony_position 

    pause_button.x = menu_buttonx_position + (3/2)*menu_buttonWidth
    pause_button.y = menu_buttony_position  

    restart_button.x = menu_buttonx_position + 3*menu_buttonWidth
    restart_button.y = menu_buttony_position 

    // Set the buttons to be interactive. Pointerover => set tint, pointerout => clear tint
    buttonsGroup.children.iterate((sprite) => {
      sprite.on('pointerover', () => {
          sprite.setTint(0x999999);
      });

      sprite.on('pointerout', () => {
          sprite.clearTint();
      });
    });
    
    
    this.actualScene = this.scene.manager.getScenes()[0]; //this line gets the current scene, which is the one that is active at the moment

    /* Set up the events for the buttons
    menu_button button on click event => goes to the menu_button scene
    pause_button button on click event => pause_buttons the game
    Restart button on click event => restarts the game
    If the game is pause_buttond, it resumes the game
    f the game is not pause_buttond, it pause_buttons the game and shows a pause_button text.*/
    
    // menu_button button on click event
    menu_button.on('pointerdown', () => {
        click_sfx.play()
        this.music.destroy()
        this.actualScene.scene.start('Menu'); 
    })

    // pause_button button on click event
    pause_button.on('pointerdown', () => {

      if (!this.actualScene.scene.isPaused()){
        click_sfx.play()
        this.actualScene.scene.pause()
        this.pause_buttonText = this.add.text(this.scale.width/2,this.scale.height/2,"PAUSA")
        .setColor("0xFFFFFF").setFontSize(60).setOrigin(0.5,0.5)
        this.music.pause()
        
      } else {
        click_sfx.play()
        this.pause_buttonText.destroy()
        this.actualScene.scene.resume()
        this.music.resume()
      }
    })

    // Restart button on click event
    restart_button.on('pointerdown', () => {
      click_sfx.play()
      this.actualScene.scene.restart(); 
      this.scene.restart(); 
    })

    // Set up the horizontal and vertical rulers
    const graphics1 = this.add.graphics()
    graphics1.lineStyle(2, 0xffffff)
    
    // Draws the horizontal ruler
    graphics1.beginPath()
    graphics1.moveTo(0, 650)
    graphics1.lineTo(1504, 650)
    graphics1.strokePath()

    // Draws the lines stepping every PIXEL_PER_METERS pixels
    for (let x = 0; x <= 1504; x += 40) {
      graphics1.moveTo(x, 650)
      graphics1.lineTo(x, 640)
      graphics1.strokePath()

      this.add.text(x, 655, `${x/this.actualScene.PIXELS_PER_METER}`, {
      fontSize: '12px',
      color: '#ffffff'
      }).setOrigin(0.5, 0)
    }

    //Draws the vertical ruler
    const graphics2 = this.actualScene.add.graphics();

    //Set the color depending on the scene
    if (this.scene.isActive("Earth")){
      graphics2.lineStyle(2, 0x000000);
    } else {
      graphics2.lineStyle(2, 0xFFFFFF);
    }
    
    const offsetX = 1260
    const offsetY = -10
    const rulerHeight = 650

    //Draws the vertical line
    graphics2.beginPath()
    graphics2.moveTo(offsetX, offsetY)
    graphics2.lineTo(offsetX, offsetY + rulerHeight)
    graphics2.strokePath()

    // Draws the lines stepping every PIXEL_PER_METER pixels
    for (let i = 0; i <= rulerHeight; i += 40) {
      const y = offsetY + rulerHeight - i
      graphics2.moveTo(offsetX, y)
      graphics2.lineTo(offsetX - 10, y)
      graphics2.strokePath()

      const valorEnMetros = i / this.actualScene.PIXELS_PER_METER;

      // Add text to the vertical ruler
      if (this.scene.isActive("Earth")){
        this.actualScene.add.text(offsetX + 5, y, `${valorEnMetros}`, {
          fontSize: '12px',
          color: '#000000'
        }).setOrigin(0, 0.5)
      } else {
          this.actualScene.add.text(offsetX + 5, y, `${valorEnMetros}`, {
          fontSize: '12px',
          color: '#FFFFFF'
        }).setOrigin(0, 0.5)
      }
    }

    // Set up the coins system
    this.coinsCollected = 0;
    this.coinIcon = this.add.image(35, 35, 'coin')
      .setScale(0.05)
      .setScrollFactor(0);
    this.coinText = this.add.text(68, 25, 'x0',{
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
    this.time.delayedCall(100, () => {
        if (!this.scene.isActive('Inputs') && this.actualScene.player.canFire == true){
            this.scene.launch('Inputs')
        }
    })

    // Check if the current scene is not the first one in the manager
    if (this.scene.manager.getScenes()[0] != this){
        this.actualScene = this.scene.manager.getScenes()[0];
    }
    
    // If the current scene is the menu_button, stop the Interface scene and destroy the music
    if (this.scene.isActive('Menu')){
        this.scene.stop()
        this.music.destroy()
    }
  }
}