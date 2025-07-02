import Phaser from 'phaser'

export default class ArrowPointer{
    constructor(scene,texture1,texture2){
        this.scene = scene
        this.image = scene.add.image(500,500,texture1).setScale(0.25).setOrigin(0,0.5)
        this.image.displayHeight/2
        this.image_head = scene.add.image(500,500,texture2).setOrigin(0,0.5).setScale(0.25)
        this.create()
    }

    create(){
    }

    lerpColor(color1, color2, t) {
        const r1 = (color1 >> 16) & 0xFF;
        const g1 = (color1 >> 8) & 0xFF;
        const b1 = color1 & 0xFF;

        const r2 = (color2 >> 16) & 0xFF;
        const g2 = (color2 >> 8) & 0xFF;
        const b2 = color2 & 0xFF;

        const r = Math.round(Phaser.Math.Linear(r1, r2, t));
        const g = Math.round(Phaser.Math.Linear(g1, g2, t));
        const b = Math.round(Phaser.Math.Linear(b1, b2, t));

        return (r << 16) | (g << 8) | b;
    }   

    update(){
        const t = 1 - (this.image.scaleX)/0.6

        const originalColor = 0xFF0000;
        const targetColor = 0x00FF00;

        this.image.setTint(this.lerpColor(originalColor, targetColor, t))
        this.image_head.setTint(this.lerpColor(originalColor, targetColor, t))

        if (this.scene.actualScene.player.canFire==true && this.scene.actualScene.player.sprite.active == true){
            this.image.setAlpha(0.7)
            this.image_head.setAlpha(0.7)
            if (this.scene.scene.isActive('Inputs')){
                const angleStr = this.scene.scene.get('Inputs').angleInput.value;
                const velocityStr = this.scene.scene.get('Inputs').velocityInput.value;

                var angleValue = (parseFloat(angleStr))
                var velocityValue = (parseFloat(velocityStr)/100)
                angleValue = Math.abs(angleValue) > 360 ? 360 : angleValue;
                velocityValue = Math.abs(velocityValue) > 1 ? 1 : velocityValue;

                this.image.x = this.scene.actualScene.player.sprite.x
                this.image.y = this.scene.actualScene.player.sprite.y

                if (!Number.isNaN(angleValue)) {
                    this.image.angle = -angleValue
                    this.image_head.angle = -(angleValue + 5)    
                    this.image_head.x = this.image.x + 200*Math.cos(angleValue*(Math.PI/180))*this.image.scaleX
                    this.image_head.y = this.image.y - 200*Math.sin(angleValue*(Math.PI/180))*this.image.scaleX
                } else {
                    this.image.angle = 0
                    this.image_head.angle = -5
                    this.image_head.setPosition(this.image.x + 200*this.image.scaleX,this.image.y)
                }

                if (!Number.isNaN(velocityValue) && velocityValue <= 100) {
                    this.image.scaleX = 2*(velocityValue) * 0.3
                } else {
                    this.image.scaleX = 1*0.3
                }
            }

        } else {
            this.image.alpha = 0
            this.image_head.alpha = 0
        }
    }
}