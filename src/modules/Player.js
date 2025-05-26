import Phaser from "phaser"
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene
    this.sprite = scene.physics.add.sprite(x, y, 'player')
    this.sprite.setCollideWorldBounds(true)   
    //const gravity_mps2 = this.scene.gravityY / 10  // convertir gravedad a m/s²
    //this.scene.physics.world.gravity.y = gravity_mps2 * PIXELS_PER_METER
  }

  fire(angle, velocity) {
    const angleRad = Phaser.Math.DegToRad(angle)
    const PIXELS_PER_METER = this.scene.PIXELS_PER_METER 
    // Velocidades en m/s
    const velocityX_mps = velocity * Math.cos(angleRad)
    const velocityY_mps = velocity * Math.sin(angleRad)

    // Convertir a pixeles/segundo
    const velocityX_px = velocityX_mps * PIXELS_PER_METER
    const velocityY_px = -velocityY_mps * PIXELS_PER_METER // Negativo porque hacia arriba
    this.sprite.setVelocity(velocityX_px, velocityY_px)
  }
 update() {
    if (this.sprite.body.blocked.down) {
        this.sprite.setVelocityX(this.sprite.body.velocity.x * 0.9); // menor a 1 = desacelera
    }
    }
}


   
    

