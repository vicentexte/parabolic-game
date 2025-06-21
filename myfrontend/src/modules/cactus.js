export default class Cactus{
    constructor(scene,x,y,texture){
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.staticImage = scene.physics.add.staticImage(x,y,texture)
    }

    fullSize(bool){
        bool?
        this.staticImage
            .setScale(0.3)
            .refreshBody()
            .setSize(100,150):
        this.staticImage
            .setScale(0.25)
            .refreshBody()
            .setSize(100,150)
        return this.staticImage
    }
}