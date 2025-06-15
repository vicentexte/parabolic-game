import Phaser from 'phaser'

// Import classes
import Player from '../modules/player.js'
import Asteroid from '@/modules/asteroid.js';
// Import assets
import background from '@/assets/sprites/backgrounds/space_bg.webp'
import goal from '@/assets/sprites/instances/general/goal.webp'
import coin from '@/assets/sprites/instances/general/coin.webp'
import asteroid from '@/assets/sprites/instances/space/asteroid.webp'
import Goal from '@/modules/goal.js';


export default class Space extends Phaser.Scene{
  constructor(){
    super({
      key:"Space",
      physics: {
        arcade: {
          debug: false,
        }
      }
    });
    this.level = 2;
  }
  // Constants for gravity physics
  PIXELS_PER_METER = 40;
  gravity = 1.6
        preload() {
            this.load.image('space_bg', background);
            this.load.image('coin', coin);
            this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
            this.load.image('goal', goal);
            this.load.image('asteroid', asteroid);
        }

        create() {
          // Set up the physics world with gravity and bounds
          this.physics.world.gravity.y = (this.gravity * this.PIXELS_PER_METER);
          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 80);

          // Create the background
          this.add.image(0, 0, 'space_bg')
            .setOrigin(0)
            .setDisplaySize( this.scale.width, this.scale.height)
            .setScrollFactor(1)

          // Create the player
          this.player = new Player(this, 0, this.scale.height)

          //Create the goal
          this.goal = new Goal(this,this.scale.width-400,150,'goal').invertColor().spaceEvent()

          // Add overlap between player and goal
          this.physics.add.overlap(this.player.sprite, this.goal.sprite, () => {
            this.player.sprite.disableBody()
            this.scene.manager.getScene('Interface').handleLevelEnd();
          })

          //Create the asteroidsGroup
          this.asteroid1 = new Asteroid(this,this.scale.width/2,100)
          this.asteroid2 = new Asteroid(this,this.scale.width/2-50,200)
          this.asteroid2.velocity /= 2
          this.asteroid2.pathIsInvert=true

          const asteroidsGroup = this.add.group()
          asteroidsGroup.add(this.asteroid1.sprite)
          asteroidsGroup.add(this.asteroid2.sprite)

          //Add overlaps between player and asteroids
          this.physics.add.overlap(this.player.sprite, asteroidsGroup, () => {
            this.scene.restart()
          },null,this)

          //Add overlap between player and coins
          const coin1 = this.physics.add.staticImage(510, 300,'coin').setScale(0.03).refreshBody()
          const coin2 = this.physics.add.staticImage(700, 250,'coin').setScale(0.03).refreshBody()
          const coinGroup = this.add.group()
          coinGroup.add(coin1)
          coinGroup.add(coin2)
          this.physics.add.overlap(this.player.sprite, coinGroup, this.scene.get('Interface').collectCoin, null, this.scene.get('Interface'))
        }

        update(time) {
          this.player.update()
          this.asteroid1.update()
          this.asteroid2.update()
          this.goal.update(time)
        }
}