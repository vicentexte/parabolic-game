import click_sfx from '../assets/sounds/sfx/click.ogg'

export default class Button {

    constructor(scene, x, y, buttonType){
        this.scene = scene;
        this.buttonType = buttonType;
        this.x = x;
        this.y = y;   
        if (buttonType != 'interface_buttons'){
            this.sprite = scene.add.image(this.x, this.y, this.buttonType).setInteractive();
        }
        
        this.create()
    }

    create(){
        const father = this.scene
        //Check if sfx exist else load itself
        if (father.sound.get('click_sfx')==null){
            father.scene.pause()
            father.load.audio('click_sfx', click_sfx);
            father.load.once('complete', () => {
                this.click_sfx = father.sound.add('click_sfx', {loop:false, volume: 1})
                father.scene.resume()
            });
            father.load.start();
        } else {
            this.click_sfx = father.sound.get('click_sfx')
        }
        
        // Set the buttons to be interactive to pointer. Pointerover => set tint, pointerout => clear tint
        if (this.buttonType != 'interface_buttons'){
            this.sprite.on('pointerover', () => {
                this.sprite.setTint(0x999999);
            })

            this.sprite.on('pointerout', () => {
                this.sprite.clearTint();
            })
        }

        const interface_scale = 0.15
        //set the functions of the buttons
        switch (this.buttonType) {
            case 'interface_buttons':
                var menu_button = new Button(father,this.x,this.y,'menu_button');
                new Button(father,this.x + menu_button.sprite.width*interface_scale*3/2,this.y,'pause_button');
                new Button(father,this.x + menu_button.sprite.width*interface_scale*3,this.y,'restart_button');
            break;

            case 'menu_button':
                this.sprite.setScale(interface_scale).setOrigin(0,0)
                this.sprite.on('pointerdown', () => {
                    this.click_sfx.play();
                    father.music.destroy();
                    father.actualScene.scene.start('Menu'); 
                })
            break;

            case 'pause_button':
                this.sprite.setScale(interface_scale).setOrigin(0,0)
                this.sprite.on('pointerdown', () => {
                    this.click_sfx.play()
                    if (!father.actualScene.scene.isPaused()){
                        father.actualScene.scene.pause() 
                        father.pause_buttonText = father.add.text(father.scale.width/2,father.scale.height/2,"PAUSA")
                        .setColor("0xFFFFFF").setFontSize(60).setOrigin(0.5,0.5)
                        father.music.pause()
                        
                    } else {
                        father.pause_buttonText.destroy()
                        father.actualScene.scene.resume()
                        father.music.resume()
                    }
                })
            break;

            case 'restart_button':
                this.sprite.setScale(interface_scale).setOrigin(0,0)
                this.sprite.on('pointerdown', () => {
                    this.click_sfx.play()
                    if (father.actualScene.scene.isPaused()){
                        father.pause_buttonText.destroy()
                        father.music.resume()
                    }
                    father.actualScene.scene.restart(); 
                })
            break;

            case 'start_button':
                this.sprite.setScale(0.3)
                this.sprite.on('pointerdown', () => { 
                    this.click_sfx.play()
                    father.scene.stop('Inputs')
                    father.autorizeTutorial = false;
                    father.time.delayedCall(200, () => {
                        father.scene.start('Earth')
                        father.scene.launch('Interface')
                    })
                })
            break;

            case 'tutorial_button':
                this.sprite.setScale(0.3)
                this.sprite.on('pointerdown', () => {
                    this.click_sfx.play()
                    father.physics.world.gravity.y = (father.gravity * father.PIXELS_PER_METER); //set up the grativity to move the player in the scene
                    /*Aquí debería ir codigo de los eventos del tutorial,
                    el cual se implementará a medida del desarrollo*/
                    father.autorizeTutorial = true; // Allow the Inputs scene to show 
                    this.sprite.destroy()
                    father.time.delayedCall(200, () => {
                        father.scene.launch('Inputs')
                    })
                })
            break;

            case 'scores_button':
                this.sprite.setScale(0.3)
                this.sprite.on('pointerdown', () => {
                    this.click_sfx.play()
                    father.scene.start('Score')
                })
            break;

            case 'back_button':
                this.sprite.setScale(0.15).setOrigin(0,0)
                this.sprite.on('pointerdown', () => {
                    this.click_sfx.play()
                    father.scene.start('Menu')
                })
            break;

            case 'next_button':
                this.sprite.setScale(0.2)
                this.sprite.on('pointerdown', () => {
                    this.click_sfx.play()
                    father.functions[father.functionSelect]()
                    father.functionSelect+=1
                })
                break;

            default:
                console.warn(`Button type ${this.buttonType} not recognized.`);
        }
    }

    update(){

    }

}