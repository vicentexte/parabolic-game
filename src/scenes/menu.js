import Phaser from 'phaser'

// Import Player class
import Player from '@/modules/Player'

//import assets
import background from '@/assets/Sprites/Backgrounds/earth_bg.webp'
import start_button from '@/assets/Sprites/Interface/start_button.webp'
import tutorial_button from '@/assets/Sprites/Interface/tutorial_button.webp'

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
    this.load.image('sky', background)
    this.load.image('start', start_button)
    this.load.image('tutorial', tutorial_button)
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
  }

  create() {
    this.PIXELS_PER_METER = 40
    this.gravity = 9.8
    this.physics.world.gravity.y = 0; // No gravity in the menu scene initially because the player is not moving until the tutorial is started
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 80); // Set bounds to the visible area of the scene

    // Create the background
    this.add.image(0, 0, 'sky')
    .setOrigin(0)
    .setDisplaySize(this.scale.width, this.scale.height)
    .setScrollFactor(1);
    // Create the player
    this.player = new Player(this,this.scale.width/2,this.scale.height/2)

    // Create the start and tutorial buttons and add interactivity
    const startButton = this.add.sprite(this.scale.width/2,this.scale.height/2-200,'start').setScale(0.3).setInteractive()
    const tutorialButton = this.add.sprite(this.scale.width/2,this.scale.height/2,'tutorial').setScale(0.3).setInteractive()
    const group = this.add.group()
    group.add(startButton)
    group.add(tutorialButton)
    group.children.iterate((button) => {
      button.on('pointerover', () => {
        button.setTint(0x999999); // Change color on hover
      });

      button.on('pointerout', () => {
        button.clearTint(); // Clear color on hover out
      });
    })
    //Tutorial button on click event => ***PASAN COSAS***
    tutorialButton.on('pointerdown', () => {
      this.physics.world.gravity.y = (this.gravity * this.PIXELS_PER_METER); //set up the grativity to move the player in the scene
      /*Aquí debería ir codigo de los eventos del tutorial,
      el cual se implementará a medida del desarrollo*/
      this.autorizeTutorial = true; // Allow the Inputs scene to show 
      tutorialButton.destroy()
      this.time.delayedCall(200, () => {
        this.scene.launch('Inputs')
      })
      
    })

    //Start button on click event => Starts the Earth scene and stops the Inputs scene if it was launched
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
    if (this.player) this.player.update() // Update the player if it exists
  }
}
