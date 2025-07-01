<template>
  <div id="phaser-container" class="game-container"></div>
</template>

<script>
import Phaser from 'phaser'
import Earth from '@/scenes/earth'
import Menu from '@/scenes/menu'
import Space from '@/scenes/space'
import Interface from '@/scenes/interface'
import Inputs from '@/scenes/inputs'
import Scores from '@/scenes/scores'
import EndGame from '@/scenes/end_game'
import Tutorial from '@/scenes/tutorial'

export default {
  name: 'PhaserGame',
  data() {
    return {
      game: null,
    }
  },
  mounted() {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'phaser-container', 
      scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
      },
      /* 
      Scenes are the different parts of your game.
      You can think of them as different levels or states.
      Each scene can have its own logic, assets, and behavior.
      The order of scenes matters, as they will be executed in the order they are listed.

      Menu: The main menu of the game.
      Interface: The UI elements that will be displayed on top of the game.
      Inputs: Handles user input and controls.
      */
      scene: [Menu,Earth,Space,Interface,Inputs,Scores,EndGame,Tutorial],
      dom: {
        createContainer: true
        }
    })
  },
  methods: {
    restartGame() {
      if (this.game) {
        this.game.destroy(true)
      }
      this.mounted() // Reinicia Phaser con el nuevo nivel
    },
  },

  beforeUnmount() {
    if (this.game) {
      this.game.destroy(true)
    }
  }
}
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>