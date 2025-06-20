
export default class ArrowPointer{
    constructor(scene,texture){
        this.scene = scene
        this.image = scene.add.image(500,500,texture).setScale(0.3)
        this.image.setOrigin(0,(this.image.displayHeight/2)/this.image.displayHeight)
        console.log(this.image.displayHeight/2)
        this.create()
    }

    
    create(){

    }

    update(){
        if (this.scene.actualScene.player.canFire==true){
            this.image.clearAlpha()
            if (this.scene.scene.isActive('Inputs')){
                this.image.angle = -parseFloat(this.scene.scene.get('Inputs').angleInput.value)
                this.image.scaleX = parseFloat(this.scene.scene.get('Inputs').velocityInput.value)/100
            }
            this.image.x = this.scene.actualScene.player.sprite.x
            this.image.y = this.scene.actualScene.player.sprite.y
        } else {
            this.image.alpha = 0
        }
    }
}