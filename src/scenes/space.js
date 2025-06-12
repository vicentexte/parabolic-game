import Phaser from 'phaser'

// Import classes
import Player from '../modules/Player.js'
import Asteroid from '@/modules/Asteroid.js';
// Import assets
import background from '@/assets/Sprites/Backgrounds/space_bg.webp'
import goal from '@/assets/Sprites/Instances/General/goal.webp'
import coin from '@/assets/Sprites/Instances/General/coin.webp'
import asteroid from '@/assets/Sprites/Instances/Space/asteroid.webp'


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

          //Create the goal, set up its size and offset
          this.goal = this.physics.add.sprite(this.scale.width-400, 150, 'goal').setScale(0.5).setTintFill(0xFFFFFF)
          this.goal.body.setSize(
            this.goal.displayWidth * 0.2, // ancho más pequeño (20% del ancho visible)
            this.goal.displayHeight * 0.65, // alto más pequeño (40% del alto visible)
          false
          ).setAllowGravity(false).setOffset(
            (this.goal.displayWidth - this.goal.body.width) ,
            (this.goal.displayHeight - this.goal.body.height + 19) 
          )

          // Add overlap between player and goal
          this.physics.add.overlap(this.player.sprite, this.goal, () => {
            this.player.sprite.setVelocity(0,0)
            this.player.sprite.body.setAllowGravity(false)
            asteroidsGroup.children.iterate((element) => {
              element.body.setSize(
              element.displayWidth * 0.1,
              element.displayHeight * 0.1,
              false)
            })
            this.scene.manager.getScene('Interface').handleLevelEnd();
            this.time.delayedCall(2500,() => {
            this.scene.start('Menu')
            })
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
          
          this.goal.body.setVelocityY(50*Math.sin(Phaser.Math.DegToRad(time/10)))
        }
}