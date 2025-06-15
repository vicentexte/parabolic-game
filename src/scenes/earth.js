import Phaser from 'phaser'

// Instances
import Player from '../modules/player.js'
import Goal from '@/modules/goal.js'

//Assets
import background from '@/assets/sprites/backgrounds/earth_bg.webp'
import goal from '@/assets/sprites/instances/general/goal.webp'
import coin from '@/assets/sprites/instances/general/coin.webp'
import trunk from '@/assets/sprites/instances/earth/trunk.webp'
import trunkHalfTop from '@/assets/sprites/instances/earth/trunk_half_top.webp'
import trunkHalfBottom from '@/assets/sprites/instances/earth/trunk_half_bottom.webp'
import branch from '@/assets/sprites/instances/earth/branch.webp'
import cactus from '@/assets/sprites/instances/earth/cactus.webp'
import vine from '@/assets/sprites/instances/earth/vine.webp'

//SFX
import click_sfx from '@/assets/sounds/sfx/click.ogg'

export default class Earth extends Phaser.Scene{
  constructor(){
    super({
      key:"Earth",
      physics: {
        arcade: {
          debug: false,
        },
      }
    });
    this.level = 1
  }
  // Constants for gravity physics
  PIXELS_PER_METER = 40;
  gravity = 9.8
        preload() {
          this.load.image('earth_bg', background);
          this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
          this.load.image('goal', goal) ;
          this.load.image('coin', coin)
          this.load.image('trunk', trunk)
          this.load.image('trunkHalfTop', trunkHalfTop)
          this.load.image('trunkHalfBottom', trunkHalfBottom)
          this.load.image('branch', branch)
          this.load.image('cactus', cactus)
          this.load.image('vine', vine)

          this.load.audio('click_sfx',click_sfx)
        }

        create() {
          // Set up the physics world with gravity and bounds
          this.physics.world.gravity.y = (this.gravity * this.PIXELS_PER_METER);
          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 80);

          // Create the background
          this.add.image(0, 0, 'earth_bg')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setScrollFactor(1);

          // Create the player
          this.player = new Player(this, 0, this.scale.height)

          // Create the goal, set up its size and offset
          this.goal = new Goal(this,1245,590,'goal')

          // Overlap between player and goal => ends the level
          this.physics.add.overlap(this.player.sprite, this.goal.sprite, () => {
            this.player.sprite.disableBody()
            this.scene.manager.getScene('Interface').handleLevelEnd();
          });
          
          // Create trunks
          const trunkGroup = this.physics.add.staticGroup();

          //trunk1
          const trunk1 = this.physics.add.staticImage(500, 510, 'trunk').setScale(0.2).refreshBody() 
          trunk1.body.setSize(
            trunk1.displayWidth * 0.38, 
            trunk1.displayHeight * 0.95, 
            false
          ).setOffset(
            (trunk1.displayWidth *0.35) ,
            (trunk1.displayHeight *0.009) 
          )

          //trunk2
          const trunk2 = this.physics.add.staticImage(510, 50, 'trunkHalfBottom').setScale(0.2).refreshBody() 
          trunk2.angle = 180
          trunk2.body.setSize(
            trunk2.displayWidth * 0.4, 
            trunk2.displayHeight * 0.95, 
            false
          ).setOffset(
            (trunk2.displayWidth *0.3) ,
            (trunk2.displayHeight *0.06) 
          )

          //trunk3
          const trunk3 = this.physics.add.staticImage(510, 230, 'trunkHalfTop').setScale(0.2).refreshBody() 
          trunk3.angle = 180;
          trunk3.body.setSize(
            trunk3.displayWidth * 0.4, 
            trunk3.displayHeight * 0.95, 
            false
          ).setOffset(
            (trunk3.displayWidth *0.3) ,
            (trunk3.displayHeight *0.06) 
          )

          //Set collider between player and trunks
          trunkGroup.add(trunk1)
          trunkGroup.add(trunk2)
          trunkGroup.add(trunk3)
          this.physics.add.collider(this.player.sprite, trunkGroup);
          
          //Create Cactus
          const cactusGroup = this.physics.add.staticGroup();

          //Cactus1
          const cactus1 = this.physics.add.staticImage(900, 570, 'cactus')
          .setScale(0.25)
          .refreshBody()
          .setSize(100,120)

          //Cactus2
          const cactus2 = this.physics.add.staticImage(800, 550, 'cactus')
          .setScale(0.3)
          .refreshBody()
          .setSize(100,150)

          //Overlap between player and cactus => restarts the scene
          cactusGroup.add(cactus1)
          cactusGroup.add(cactus2)
          this.physics.add.overlap(this.player.sprite, cactusGroup, () => {
            this.scene.restart()
          })

          //Create vine
          const vine = this.physics.add.staticImage(900, 95, 'vine')
            .setScale(0.2)
            .refreshBody()
            .setSize(30,400)
          vine.setOffset(
            (vine.displayWidth-95),
            (vine.displayHeight-400) 
          )

          //Overlap between player and vine => slows down the player
          this.physics.add.overlap(this.player.sprite, vine, () => {
              this.player.sprite.setVelocityX(this.player.sprite.body.velocity.x /3);
              this.player.sprite.setVelocityY(this.player.sprite.body.velocity.y /3);
          })
          
          //Create coins
          const coinGroup = this.physics.add.staticGroup();
          const coin1 = this.physics.add.staticImage(510, 145,'coin').setScale(0.03).refreshBody()
          const coin2 = this.physics.add.staticImage(770, 250,'coin').setScale(0.03).refreshBody()
          
          //Overlap between player and coin => collects the coin
          coinGroup.add(coin1)
          coinGroup.add(coin2)
          this.physics.add.overlap(this.player.sprite, coinGroup, this.scene.get('Interface').collectCoin, null, this.scene.get('Interface'))
        }

        update() {
          this.player.update()
        }
}