export default class Player {
  constructor(scene, x, y) {
    this.scene = scene
    this.sprite = scene.physics.add.sprite(x, y, 'player')
    this.sprite.setCollideWorldBounds(true)
  }

  fire(vx, vy) {
    this.sprite.setVelocity(vx, vy)
  }
 update() {
    if (this.sprite.body.blocked.down) {
        this.sprite.setVelocityX(this.sprite.body.velocity.x * 0.9); // menor a 1 = desacelera
    }
    }
}


   
    

