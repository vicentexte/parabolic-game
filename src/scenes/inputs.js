import Phaser from "phaser";

//Import html content
import html_content from '../html/inputs.html'

// Import assets
import dom_bg from '@/assets/sprites/interface/dom_bg.webp'
import angle_label from '@/assets/sprites/interface/angle_label.webp'
import velocity_label from '@/assets/sprites/interface/velocity_label.webp'
import fire_button from '@/assets/sprites/interface/fire_button.webp'

export default class Inputs extends Phaser.Scene{

  constructor(){
    super({
      key:"Inputs"
      });
  }

  create(){
    // === Inputs HTML with Phaser's DOM ===
    const inputContainer = this.add.dom(0, this.scale.height/2).createFromHTML(html_content
        .replace('{{dom_bg}}', dom_bg)
        .replace('{{angle_label}}', angle_label)
        .replace('{{velocity_label}}', velocity_label)
        .replace('{{fire_button}}', fire_button)
    ).setScale(0.9).setOrigin(0,0.5)
    // Ángulo
    this.angleInput = inputContainer.node.querySelector('input[name="angle"]')
    // Velocidad
    this.velocityInput = inputContainer.node.querySelector('input[name="velocity"]')
    // Boton fire
    this.fireButton =  inputContainer.node.querySelector('button')
    
    //Onclick event for the fire button
    this.fireButton.addEventListener('click', () => {
      const angleVal = parseFloat(this.angleInput.value)
      const velocityVal = parseFloat(this.velocityInput.value)
      this.actualScene = this.scene.manager.getScenes()[0];
      if (angleVal != 0 && Math.abs(angleVal) < 360 && velocityVal != 0 && Math.abs(velocityVal) < 500){ //for limit the angle and velocity values
          this.actualScene.player.fire(angleVal,velocityVal)
          if (!this.scene.isActive('Menu'))  this.scene.stop()
          }
    })
  }

  update(){
    if (!this.scene.manager.isActive('Interface') && this.scene.manager.getScene('Menu').autorizeTutorial == false) this.scene.stop()
  }
}