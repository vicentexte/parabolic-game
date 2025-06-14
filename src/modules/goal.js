import Phaser from "phaser";
export default class Goal {
    constructor(scene,x,y,texture){
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.image = scene.physics.add.sprite(x,y,texture)
        this.create()
    }

    create(){
        //adjust image
        const image = this.image
        const body = this.image.body
        image.setScale(0.5)
        body.setSize(
            image.displayWidth*0.2,
            image.displayHeight*0.65,
            false
        ).setOffset(
            (image.displayWidth - body.width),
            (image.displayHeight - body.height+19)
        ).setAllowGravity(false)
    }

    invertColor(){
        const image = this.image
        image.setTintFill(0xFFFFFF)
        return this
    }

    spaceEvent(){
        this.isSpace = true
        return this
    }

    update(time){
        if (this.isSpace){
            this.image.body.setVelocityY(50*Math.sin(Phaser.Math.DegToRad(time/10)))
        }
    }
}