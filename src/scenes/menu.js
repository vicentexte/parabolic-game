import Phaser from 'phaser'

// Import Player class
import Player from '@/modules/player'

//import assets
import background from '@/assets/sprites/backgrounds/earth_bg.webp'
import start_button from '@/assets/sprites/interface/start_button.webp'
import tutorial_button from '@/assets/sprites/interface/tutorial_button.webp'
import Button from '@/modules/button'

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

  autorizeTutorial = false // Variable to control if the tutorial is authorized, important for the Inputs scene

  preload() {
    this.load.image('menu_bg', background)
    this.load.image('start_button', start_button)
    this.load.image('tutorial_button', tutorial_button)
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
  }

  create() {
    this.PIXELS_PER_METER = 40
    this.gravity = 9.8
    this.physics.world.gravity.y = 0; // No gravity in the menu scene initially because the player is not moving until the tutorial is started
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 80); // Set bounds to the visible area of the scene

    // Create the background
    this.add.image(0, 0, 'menu_bg')
    .setOrigin(0)
    .setDisplaySize(this.scale.width, this.scale.height)
    .setScrollFactor(1);
    // Create the player
    this.player = new Player(this,this.scale.width/2,this.scale.height/2)

    //Create Buttons
    this.start_button = new Button(this,this.scale.width/2,this.scale.height/2-200,'start_button')
    this.tutorial_button = new Button(this,this.scale.width/2,this.scale.height/2,'tutorial_button')
  }

  update(){
    if (this.player) this.player.update() // Update the player if it exists

  }


}
