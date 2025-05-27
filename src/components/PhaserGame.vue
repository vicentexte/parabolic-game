<template>
  <div id="phaser-container" class="game-container"></div>
</template>

<script>
import Phaser from 'phaser'
import Earth from '@/scenes/earth'
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
      scene: [Earth],
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