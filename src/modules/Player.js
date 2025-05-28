import Phaser from "phaser"
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene
    this.sprite = scene.physics.add.sprite(x, y, 'player')
    this.sprite.setCollideWorldBounds(true) 
    this.sprite.setBounce(0.3)
    this.canFire = false
    this.jumpCount = 0;
  }

  fire(angle, velocity) {
    if (this.canFire == true){
      const angleRad = Phaser.Math.DegToRad(angle)
      const PIXELS_PER_METER = this.scene.PIXELS_PER_METER 
      // Velocidades en m/s
      const velocityX_mps = velocity * Math.cos(angleRad)
      const velocityY_mps = velocity * Math.sin(angleRad)

      // Convertir a pixeles/segundo
      const velocityX_px = velocityX_mps * PIXELS_PER_METER
      const velocityY_px = -velocityY_mps * PIXELS_PER_METER // Negativo porque hacia arriba
      this.canFire = false
      this.sprite.setVelocity(velocityX_px, velocityY_px)
      this.jumpCount++;
    }
  }

 update() {
    if (this.canFire == false){
      if (Math.abs(this.sprite.body.velocity.x) < 0.5 && Math.abs(this.sprite.body.velocity.y) < 2){
        this.canFire = true
      }
    }
    
    if (this.sprite.body.blocked.down) {
        this.sprite.setVelocityX(this.sprite.body.velocity.x * 0.95); // menor a 1 = desacelera
    }
    }
}
