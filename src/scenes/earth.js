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
          this.load.audio('music', require('@/assets/music.mp3'))
        }

        create() {
          this.music = this.sound.add('music',{loop: true, volume: 0.2})
          this.music.play()
          this.gravity = 9.8
          this.physics.world.gravity.y = (this.gravity * this.PIXELS_PER_METER);
          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 80);
          this.add.image(0, 0, 'sky')
            .setOrigin(0)
            .setDisplaySize(3000, this.scale.height)
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

          // plataformas y obstaculos       
          //this.obstacles = this.physics.add.staticGroup()

          //this.obstacles.create(1000, 350, 'platform').setScale(1).refreshBody()

          // Detecta colisiones
          //this.physics.add.collider(this.player.sprite, this.obstacles)
          
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
            this.music.destroy()
          })
           this.cactus2 = this.physics.add.staticImage(800, 550, 'cactus')
          .setScale(0.3)
          .refreshBody()
          .setSize(100,150)
          this.physics.add.overlap(this.player.sprite, this.cactus2, () => {
            this.scene.restart()
            this.music.destroy()
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
          

          //sistema de monedas
          const collectCoin = (player, coin) => {
            coin.disableBody(true, true);
            this.coinsCollected++;
            this.coinText.setText('x ' + this.coinsCollected);
          };


          this.coin = this.physics.add.staticImage(510, 145,'coin').setScale(0.03).refreshBody()
          this.physics.add.overlap(this.player.sprite, this.coin, collectCoin, null, this)
          this.coin2 = this.physics.add.staticImage(770, 250,'coin').setScale(0.03).refreshBody()
          this.physics.add.overlap(this.player.sprite, this.coin2, collectCoin, null, this)
          
          this.coinsCollected = 0;
          this.coinIcon = this.add.image(35, 35, 'coin')
            .setScale(0.05)
            .setScrollFactor(0);

          this.coinText = this.add.text(68, 25, 'x 0', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial'
          }).setScrollFactor(0);

          //sistema de estrellas
          const handleLevelEnd = () => {
            const jumps = this.player.jumpCount;
            let stars = 0;

            if (jumps === 1) {
              stars = 3;
            } else if (jumps === 2) {
              stars = 2;
            } else {
              stars = 0;
            }

            const starText = stars === 0 ? '❌ No stars' : '⭐'.repeat(stars);
            this.add.text(this.scale.width / 2, this.scale.height / 2, starText, {
              fontSize: '40px',
              color: '#fff',
              fontFamily: 'Arial',
              backgroundColor: '#000'
            }).setOrigin(0.5).setScrollFactor(0);
          };

          this.physics.add.overlap(this.player.sprite, this.goal, () => {
            handleLevelEnd();
          });

          this.physics.add.overlap(this.player.sprite, this.goal, () => {
            this.scene.start('Space')
            this.music.destroy()
          })

          this.graphics = this.add.graphics()
          this.graphics.lineStyle(2, 0xffffff)  // línea blanca

          // Dibuja la línea horizontal (regla)
          this.graphics.beginPath()
          this.graphics.moveTo(0, 650)
          this.graphics.lineTo(1504, 650)
          this.graphics.strokePath()

          // Dibuja las marcas cada 40 píxeles
          for (let x = 0; x <= 1504; x += 40) {
            this.graphics.moveTo(x, 650)
            this.graphics.lineTo(x, 640)
            this.graphics.strokePath()

            this.add.text(x, 655, `${x/this.PIXELS_PER_METER}`, {
              fontSize: '12px',
              color: '#ffffff'
            }).setOrigin(0.5, 0)  // centrar texto sobre la marca
          }
           const graphics2 = this.add.graphics();
            graphics2.lineStyle(2, 0x000000);  // línea blanca

            const offsetX = 1260;  // Mueve la regla horizontalmente (izquierda/derecha)
            const offsetY = -10;   // Mueve la regla verticalmente (arriba/abajo)
            const alturaRegla = 650; // Alto total de la regla

            // Dibuja la línea vertical (regla)
            graphics2.beginPath();
            graphics2.moveTo(offsetX, offsetY);
            graphics2.lineTo(offsetX, offsetY + alturaRegla);
            graphics2.strokePath();

            // Dibuja marcas y números desde abajo hacia arriba
            for (let i = 0; i <= alturaRegla; i += 40) {
              const y = offsetY + alturaRegla - i;

              graphics2.moveTo(offsetX, y);
              graphics2.lineTo(offsetX - 10, y); // Marca hacia la izquierda
              graphics2.strokePath();

              const valorEnMetros = i / this.PIXELS_PER_METER;

              this.add.text(offsetX + 5, y, `${valorEnMetros}`, {
                fontSize: '12px',
                color: '#000000'
              }).setOrigin(0, 0.5);
            }
        }

        update() {
          this.player.update()
        }
}