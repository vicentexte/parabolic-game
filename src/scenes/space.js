import Player from '../modules/Player.js'
import Asteroid from '@/modules/Asteroid.js';
import Phaser from 'phaser'

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
  PIXELS_PER_METER = 40;
  gravity = 1.6
  player;
        preload() {
            this.load.image('space', require('@/assets/luna.jpg'));
            this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
            this.load.image('goal', require('@/assets/goal.png'));
            this.load.image('asteroid', require('@/assets/asteroid1.png'));
        }

        create() {
          this.physics.world.gravity.y = (this.gravity * this.PIXELS_PER_METER);
          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 80);

          const background = this.add.image(0, 0, 'space')
            .setOrigin(0)
            .setDisplaySize( this.scale.width, this.scale.height)
            .setScrollFactor(1);
          Phaser.Actions.SetDepth(background, 0);

          //meta #############
          this.goal = this.physics.add.sprite(this.scale.width-400, 150, 'goal') // Crea una imagen de meta
          this.goal.setScale(0.5)
          this.goal.body.setSize(
          this.goal.displayWidth * 0.2, // ancho más pequeño (20% del ancho visible)
          this.goal.displayHeight * 0.65, // alto más pequeño (40% del alto visible)
          false
          )
          this.goal.body.setAllowGravity(false)
          this.goal.setTintFill(0xFFFFFF)
          
          this.goal.body.setOffset(
            (this.goal.displayWidth - this.goal.body.width) ,
            (this.goal.displayHeight - this.goal.body.height + 19) 
          )
          //##################

          this.player = new Player(this, 0, this.scale.height)
          this.asteroid1 = new Asteroid(this,this.scale.width/2,100)
          this.asteroid2 = new Asteroid(this,this.scale.width/2-50,200)
          this.asteroid2.velocity /= 2
          this.asteroid2.pathIsInvert=true
          const asteroids = this.add.group()
          asteroids.add(this.asteroid1.sprite)
          asteroids.add(this.asteroid2.sprite)

          this.coin = this.physics.add.staticImage(510, 300,'coin').setScale(0.03).refreshBody()
          this.physics.add.overlap(this.player.sprite, this.coin, this.scene.get('Interface').collectCoin, null, this.scene.get('Interface'))
          this.coin2 = this.physics.add.staticImage(700, 250,'coin').setScale(0.03).refreshBody()
          this.physics.add.overlap(this.player.sprite, this.coin2, this.scene.get('Interface').collectCoin, null, this.scene.get('Interface'))

          this.physics.add.overlap(this.player.sprite, asteroids, () => {
            this.scene.restart()
          },null,this)

          this.physics.add.overlap(this.player.sprite, this.goal, () => {
            this.player.sprite.setVelocity(0,0)
            this.player.sprite.body.setAllowGravity(false)
            asteroids.children.iterate((element) => {
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
        }

        update(time) {
          this.player.update()
          this.asteroid1.update()
          this.asteroid2.update()
          
          this.goal.body.setVelocityY(50*Math.sin(Phaser.Math.DegToRad(time/10)))
        }
}