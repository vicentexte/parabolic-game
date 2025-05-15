<template>
    <div>
        <label for="">Angle</label>
        <input type="number" v-model="angle"> 
        <label for="">Velocity</label>
        <input type="number" v-model:="velocity"> 
        <button type="submit" @click="fire">FIRE!</button>
    </div>
</template>

<script>
import Phaser from 'phaser';
import Player from '../modules/Player.js'
export default{
    name: 'PhaserGame',
    data(){
        return {
            game: null,
            playerInstance: null,
            velocity: 450,
            angle: 45
        }
    },
    create() {
    
    },
    mounted() {
        const vue = this
        let player
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
            default: 'arcade',
                arcade: {
                    gravity: { y: 300},
                    debug: false
                }
            },
            scene: {
                preload() {
                    this.load.image('sky', 'images/background.png');
                    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
                },

                create() {
                    this.add.image(400, 300, 'sky');
                    player = new Player(this, 0, 300,0,0);
                    vue.playerInstance = player;
                },
                
                update() {
                    player.update();
                }
            }
        }

        this.game = new Phaser.Game(config);
    },

    methods: {
        fire(){
            this.playerInstance.angle = this.angle;
            this.playerInstance.velocity = this.velocity;
            this.playerInstance.fire();
        }
    },
    beforeUnmount() {
        if (this.game) {
        this.game.destroy(true);
        }
    }
}
</script>