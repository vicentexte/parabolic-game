import Phaser from 'phaser';
export default class Interface extends Phaser.Scene{
  constructor(){
    super({
      key:"Interface"
      });
  }
  actualScene;
  coinsCollected;
  coinText;
  finalText;
  
  preload(){
    this.load.image('menu', require('@/assets/menu.png'));
    this.load.image('pause', require('@/assets/pause.png'));
    this.load.image('restart', require('@/assets/restart.png'));
    this.load.audio('music', require('@/assets/music.mp3'))
  }
  create(){
    this.music = this.sound.add('music',{loop: true, volume: 0.2})
    this.music.play()
    //menu de opciones
    const menu_scale = 0.15
    this.menu = this.add.image(0, 0, 'menu').setScale(menu_scale).setOrigin(0,0).setInteractive()
    this.pause = this.add.image(0, 0, 'pause').setScale(menu_scale).setOrigin(0,0).setInteractive()
    this.restart = this.add.image(0, 0, 'restart').setScale(menu_scale).setOrigin(0,0).setInteractive()
    const group = this.add.group()
    group.add(this.menu)
    group.add(this.pause)
    group.add(this.restart)
    const menux_position = this.scale.width - this.menu.displayWidth * 5
    const menuy_position = 0

    this.menu.x = menux_position
    this.menu.y = menuy_position 

    this.pause.x = menux_position + this.menu.displayWidth + this.menu.displayWidth/2
    this.pause.y = menuy_position  

    this.restart.x = menux_position + this.menu.displayWidth*2 + this.menu.displayWidth
    this.restart.y = menuy_position 

    group.children.iterate((sprite) => {
      sprite.on('pointerover', () => {
          sprite.setTint(0x999999);
      });

      sprite.on('pointerout', () => {
          sprite.clearTint();
      });
    });
    
    
    this.actualScene = this.scene.manager.getScenes()[0];

    this.menu.on('pointerdown', () => {
        this.actualScene.scene.start('Menu'); 
        this.music.destroy();
    })
    this.pause.on('pointerdown', () => {
        if (!this.actualScene.scene.isPaused()){
            this.actualScene.scene.pause(); {
              this.pauseText = this.add.text(this.scale.width/2,this.scale.height/2,"PAUSA")
              .setColor("0xFFFFFF").setFontSize(60).setOrigin(0.5,0.5)
              this.music.pause()
            }
        } else {
          this.pauseText.destroy()
            this.actualScene.scene.resume(); this.music.resume()
        }
    })
    this.restart.on('pointerdown', () => {this.actualScene.scene.restart(); this.scene.restart()})
    this.actualScene.graphics = this.add.graphics()
    this.actualScene.graphics.lineStyle(2, 0xffffff)  // línea blanca
    
    // Dibuja la línea horizontal (regla)
    this.actualScene.graphics.beginPath()
    this.actualScene.graphics.moveTo(0, 650)
    this.actualScene.graphics.lineTo(1504, 650)
    this.actualScene.graphics.strokePath()

    // Dibuja las marcas cada 40 píxeles
    for (let x = 0; x <= 1504; x += 40) {
      this.actualScene.graphics.moveTo(x, 650)
      this.actualScene.graphics.lineTo(x, 640)
      this.actualScene.graphics.strokePath()

      this.add.text(x, 655, `${x/this.actualScene.PIXELS_PER_METER}`, {
      fontSize: '12px',
      color: '#ffffff'
      }).setOrigin(0.5, 0)  // centrar texto sobre la marca
    }
    const graphics2 = this.actualScene.add.graphics();
    if (this.scene.isActive("Earth")){
      graphics2.lineStyle(2, 0x000000);
    } else {
      graphics2.lineStyle(2, 0xFFFFFF);
    }
    
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

      const valorEnMetros = i / this.actualScene.PIXELS_PER_METER;

      if (this.scene.isActive("Earth")){
        this.actualScene.add.text(offsetX + 5, y, `${valorEnMetros}`, {
          fontSize: '12px',
          color: '#000000'
        }).setOrigin(0, 0.5);
      } else {
          this.actualScene.add.text(offsetX + 5, y, `${valorEnMetros}`, {
          fontSize: '12px',
          color: '#FFFFFF'
        }).setOrigin(0, 0.5);
      }
    }
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

  //sistema de monedas
  collectCoin(player, coin){
    coin.disableBody(true, true);
    this.coinsCollected++;
    this.coinText.setText('x' + this.coinsCollected)
  }

  //sistema de estrellas
  handleLevelEnd = () => {
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
    this.finalText = this.add.text(this.actualScene.scale.width / 2, this.actualScene.scale.height / 2, starText, {
      fontSize: '40px',
      color: '#fff',
      fontFamily: 'Arial',
      backgroundColor: '#000'
    }).setOrigin(0.5).setScrollFactor(0);
  }
  destroyText(){
    this.scene.restart()
  }
  update(){
    this.time.delayedCall(100, () => {
        if (!this.scene.isActive('Inputs') && this.actualScene.player.canFire == true){
            this.scene.launch('Inputs')
        }
    })

    if (this.scene.manager.getScenes()[0] != this){
        this.actualScene = this.scene.manager.getScenes()[0];
    }
    
    if (this.scene.isActive('Menu')){
        this.scene.stop()
    }
  }
}