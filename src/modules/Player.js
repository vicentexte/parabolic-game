export default class Player {
    constructor(scene, x, y,velocity,angle) {
        this.angle = angle;
        this.velocity = velocity;
        this.scene = scene;

        this.sprite = scene.physics.add.sprite(x, y, 'player');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0.2);
    }

    update() {
    if (this.sprite.body.blocked.down) {
        this.sprite.setVelocityX(this.sprite.body.velocity.x * 0.9); // menor a 1 = desacelera
    }
    }
    
    fire() {
        const rad = this.angle/360*2*Math.PI;
        const vx = this.velocity * Math.cos(rad);
        const vy = -this.velocity * Math.sin(rad); // Negativo porque Y crece hacia abajo
        this.sprite.setVelocity(vx, vy);
    }
}