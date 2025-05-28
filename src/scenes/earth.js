import Player from '../modules/Player.js'
import Phaser from 'phaser'

export default class Earth extends Phaser.Scene{
  constructor(){
    super({
      key:"Earth",
      physics: {
        arcade: {
          debug: true,
        }
      }
    });
  }
  PIXELS_PER_METER = 40;
  gravity = 9.8
  player;
        preload() {
          this.load.image('sky', require('@/assets/background.png'));
          this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
          this.load.image('goal', require('@/assets/goal.png')) ;
          this.load.image('spikes', require('@/assets/spikes.png'))
          this.load.image('coin', require('@/assets/coin.png'))
          this.load.image('wood', require('@/assets/tronco.webp'))
          this.load.image('woodmitad1', require('@/assets/troncomitad1.png'))
          this.load.image('woodmitad2', require('@/assets/troncomitad2.png'))
          this.load.image('rama', require('@/assets/rama1.png'))
          this.load.image('cactus', require('@/assets/cactus.png'))
          this.load.image('liana', require('@/assets/liana.png'))
        }

        create() {
          this.physics.world.gravity.y = (this.gravity * this.PIXELS_PER_METER);
          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 80);
          this.add.image(0, 0, 'sky')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setScrollFactor(1);

          this.player = new Player(this, 0, this.scale.height)

          //meta final
          this.goal = this.physics.add.staticImage(1245, 590, 'goal') // Crea una imagen de meta
          this.goal.setScale(0.5)
          this.goal.body.setSize(
            this.goal.displayWidth * 0.2, 
            this.goal.displayHeight * 0.65, 
            false
          )
          this.goal.body.setOffset(
            (this.goal.displayWidth - this.goal.body.width) ,
            (this.goal.displayHeight - this.goal.body.height+19) 
          )
          
          this.wood1 = this.physics.add.staticImage(500, 510, 'wood').setScale(0.2).refreshBody() 
          this.physics.add.collider(this.player.sprite, this.wood1)
          this.wood1.body.setSize(
            this.wood1.displayWidth * 0.38, 
            this.wood1.displayHeight * 0.95, 
            false
          )
          this.wood1.body.setOffset(
            (this.wood1.displayWidth *0.35) ,
            (this.wood1.displayHeight *0.009) 
          )

          this.wood2 = this.physics.add.staticImage(510, 50, 'woodmitad1').setScale(0.2).refreshBody() 
          this.physics.add.collider(this.player.sprite, this.wood2)
          this.wood2.angle = 180;
          this.wood2.body.setSize(
            this.wood2.displayWidth * 0.4, 
            this.wood2.displayHeight * 0.95, 
            false
          )
          this.wood2.body.setOffset(
            (this.wood2.displayWidth *0.3) ,
            (this.wood2.displayHeight *0.06) 
          )

          this.wood3 = this.physics.add.staticImage(510, 230, 'woodmitad2').setScale(0.2).refreshBody() 
          this.physics.add.collider(this.player.sprite, this.wood3)
          this.wood3.angle = 180;
          this.wood3.body.setSize(
            this.wood3.displayWidth * 0.4, 
            this.wood3.displayHeight * 0.95, 
            false
          )
          this.wood3.body.setOffset(
            (this.wood3.displayWidth *0.3) ,
            (this.wood3.displayHeight *0.06) 
          )
          
          this.cactus = this.physics.add.staticImage(900, 570, 'cactus')
          .setScale(0.25)
          .refreshBody()
          .setSize(100,120)
          this.physics.add.overlap(this.player.sprite, this.cactus, () => {
            this.scene.restart()
          })
           this.cactus2 = this.physics.add.staticImage(800, 550, 'cactus')
          .setScale(0.3)
          .refreshBody()
          .setSize(100,150)
          this.physics.add.overlap(this.player.sprite, this.cactus2, () => {
            this.scene.restart()
          })
          const liana = this.physics.add.staticImage(900, 95, 'liana')
          liana.setScale(0.2)
          liana.refreshBody()
          liana.setSize(30,400)
          liana.setOffset(
            (liana.displayWidth-95) ,
            (liana.displayHeight-400) 
          )
          this.physics.add.overlap(this.player.sprite, liana, () => {
              this.player.sprite.setVelocityX(this.player.sprite.body.velocity.x /3);
              this.player.sprite.setVelocityY(this.player.sprite.body.velocity.y /3);
          })
          
          this.coin = this.physics.add.staticImage(510, 145,'coin').setScale(0.03).refreshBody()
          this.physics.add.overlap(this.player.sprite, this.coin, this.scene.get('Interface').collectCoin, null, this.scene.get('Interface'))
          this.coin2 = this.physics.add.staticImage(770, 250,'coin').setScale(0.03).refreshBody()
          this.physics.add.overlap(this.player.sprite, this.coin2, this.scene.get('Interface').collectCoin, null, this.scene.get('Interface'))
          
          this.physics.add.overlap(this.player.sprite, this.goal, () => {
            this.scene.manager.getScene('Interface').handleLevelEnd();
            this.time.delayedCall(5000,() => {
              this.scene.get('Interface').destroyText()
              this.scene.start('Space')
            })
          });
        }

        update() {
          this.player.update()
        }
}