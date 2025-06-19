export default class Coin{
    constructor(scene,x,y,texture){
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.staticImage = scene.physics.add.staticImage(x,y,texture).setScale(0.03).refreshBody()
    }
}