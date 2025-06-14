<template>
  <div id="phaser-container" class="game-container"></div>
</template>

<script>
import TestScene from '@/scenes/test_scene'
import Phaser from 'phaser'


export default {
  name: 'PlayGround',
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
      scene: [TestScene],
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