export default class Vine {
    constructor(scene,x,y,texture){
        this.scene = scene
        this.x = x
        this.y = y
        this.staticImage = scene.physics.add.staticImage(900, 95, texture)
            .setScale(0.2)
            .refreshBody()
            .setSize(30,400)
        this.staticImage.setOffset(
            (this.staticImage.displayWidth-95),
            (this.staticImage.displayHeight-400) 
        )
    }
}