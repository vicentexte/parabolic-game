import Phaser from "phaser"
export default class Asteroid{
    constructor(scene,x,y){
        this.scene = scene
        this.sprite = this.scene.physics.add.sprite(x,y,'asteroid').setScale(0.15)
        this.sprite.body.setSize(
            this.sprite.displayWidth*3,
            this.sprite.displayHeight*3,
            true
        )
        this.sprite.body.setAllowGravity(false)
        this.velocity = 350
        this.angle = 0
        this.pathIsInvert = false
    }

    path(vx,vy){
        this.sprite.setVelocity(vx*Math.cos(Phaser.Math.DegToRad(this.angle)),vy*Math.sin(Phaser.Math.DegToRad(this.angle))) 
        this.sprite.angle = Phaser.Math.RadToDeg(Math.atan2(this.sprite.body.velocity.y,this.sprite.body.velocity.x))-135
    }

    update(){
        this.angle = this.angle + 1
        if (!this.pathIsInvert) this.path(this.velocity,this.velocity); 
        else {this.path(-this.velocity,this.velocity)}
    }
}