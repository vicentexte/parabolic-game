<template>
  <div id="phaser-container"></div>
</template>

<script>
import Phaser from 'phaser'
import Player from '../modules/Player.js'

export default {
  name: 'PhaserGame',
  data() {
    return {
      game: null,
      playerInstance: null,
      velocity: 450,
      angle: 45,
      currentLevelIndex: 0,
      levels: [
      { name: 'Tierra', gravityY: 980 },  // *10 para mayor efecto visual
      { name: 'Luna', gravityY: 160 },
      { name: 'Marte', gravityY: 370 },
      { name: 'Júpiter', gravityY: 2480 }
      ]
    }
  },
  mounted() {
    const vue = this
    let player

    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-container', 
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      dom: {
        createContainer: true
      },
      scene: {
        preload() {
          this.load.image('sky', require('@/assets/background.png'))
          this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png')
          this.load.image('goal', require('@/assets/goal.png')) 
        },
        create() {


          this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
          this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
          
          this.add.image(0, 0, 'sky')
            .setOrigin(0)
            .setDisplaySize(3000, this.scale.height)
            .setScrollFactor(1);

          player = new Player(this, 100, 300, 0, 0)
          vue.playerInstance = player

                        const currentLevel = vue.levels[vue.currentLevelIndex]
                        this.physics.world.gravity.y = currentLevel.gravityY

                        // Mostrar el nombre del nivel
                        this.levelText = this.add.text(16, 16, 'Nivel: ' + currentLevel.name, {
                          fontSize: '24px',
                          fill: '#fff'
                        }).setScrollFactor(0)

                        this.goal = this.physics.add.staticImage(1400, 150, 'goal') // Crea una imagen de meta
                        this.goal.setScale(0.5)
                        this.physics.add.overlap(player.sprite, this.goal, () => {
                          vue.nextLevel()
                        })
                        
          this.input.keyboard.on('keydown-F', () => {
            if (!this.scale.isFullscreen) {
              this.scale.startFullscreen()
            } else {
              this.scale.stopFullscreen()
            }
          })

          this.cameras.main.startFollow(player.sprite)

          // === Inputs HTML con DOM de Phaser ===

          // Ángulo
          this.angleInput = this.add.dom(this.scale.width / 2, 100).createFromHTML(`
            <input type="number" name="angle" value="45" placeholder="Angle"
                   style="width: 80px; padding: 4px; font-size: 16px;">
          `)

          // Velocidad
          this.velocityInput = this.add.dom(this.scale.width / 2, 150).createFromHTML(`
            <input type="number" name="velocity" value="450" placeholder="Velocity"
                   style="width: 80px; padding: 4px; font-size: 16px;">
          `)

          // Boton fire
          this.fireButton = this.add.dom(this.scale.width / 2, 200).createFromHTML(`
            <button style="padding: 6px 12px; font-size: 16px;">FIRE!</button>
          `)

          this.fireButton.addListener('click')
          this.fireButton.on('click', () => {
            const angleVal = parseFloat(this.angleInput.getChildByName('angle').value)
            const velocityVal = parseFloat(this.velocityInput.getChildByName('velocity').value)

            if (!isNaN(angleVal) && !isNaN(velocityVal)) {
              vue.angle = angleVal
              vue.velocity = velocityVal
              vue.fire()
            } else {
              console.log('Valores inválidos')
            }
          })
          this.angleInput.setOrigin(0.5)
          this.velocityInput.setOrigin(0.5)
          this.fireButton.setOrigin(0.5)


        },
        update() {
          player.update()
        }
      }
    }

    this.game = new Phaser.Game(config)
  },
  methods: {

              nextLevel() {
                if (this.currentLevelIndex < this.levels.length - 1) {
                  this.currentLevelIndex++
                  this.restartGame()
                } else {
                  alert("¡Felicidades! Completaste todos los niveles.")
                }
              },
              restartGame() {
                if (this.game) {
                  this.game.destroy(true)
                }
                //this.mounted() // Reinicia Phaser con el nuevo nivel
              },

    fire() {
      this.playerInstance.angle = this.angle
      this.playerInstance.velocity = this.velocity
      this.playerInstance.fire()
    }
  },
  beforeUnmount() {
    if (this.game) {
      this.game.destroy(true)
    }
  }
}
</script>

<style scoped>
#phaser-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

/* Forzar visibilidad de elementos DOM agregados por Phaser */
::v-deep .phaser-dom-element {
  z-index: 10;
  position: absolute !important;
}
</style>
