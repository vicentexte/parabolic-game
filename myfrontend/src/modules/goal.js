import Phaser from "phaser";
export default class Goal {
    constructor(scene,x,y,texture){
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.sprite = scene.physics.add.sprite(x,y,texture)
        this.create()
    }

    create(){
        //adjust sprite
        const sprite = this.sprite
        const body = this.sprite.body
        sprite.setScale(0.5)
        body.setSize(
            sprite.displayWidth*0.2,
            sprite.displayHeight*0.65,
            false
        ).setOffset(
            (sprite.displayWidth - body.width),
            (sprite.displayHeight - body.height+19)
        ).setAllowGravity(false)

        //player overlap
        this.scene.physics.add.overlap(this.scene.player.sprite, this.sprite, () => {
            this.scene.scene.get("Interface").passed == true
            this.scene.player.sprite.disableBody(true)
            this.scene.scene.get("Interface").lifes += 1
            this.scene.scene.manager.getScene('Interface').handleLevelEnd();
            
          });
    }

    invertColor(){
        const sprite = this.sprite
        sprite.setTintFill(0xFFFFFF)
        return this
    }

    spaceEvent(){
        this.isSpace = true
        return this
    }

    update(time){
        if (this.isSpace){
            this.sprite.body.setVelocityY(50*Math.sin(Phaser.Math.DegToRad(time/10)))
        }
    }
}