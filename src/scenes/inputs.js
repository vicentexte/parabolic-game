import Phaser from "phaser";
import htmlContent from '../html/inputs.html'
import madera from '../assets/dom_back.png'
import labelAngulo from '../assets/angle.png'
import labelVelocidad from '../assets/velocity.png'
import botonFuego from '../assets/button.png'
export default class Inputs extends Phaser.Scene{
  constructor(){
    super({
      key:"Inputs"
      });
  }
  create(){
    // === Inputs HTML con DOM de Phaser ===
    const inputContainer = this.add.dom(0, this.scale.height/2).createFromHTML(htmlContent
        .replace('{{madera}}', madera)
        .replace('{{labelAngulo}}', labelAngulo)
        .replace('{{labelVelocidad}}', labelVelocidad)
        .replace('{{botonFuego}}', botonFuego)
    );
    inputContainer.setScale(0.9)
    inputContainer.setOrigin(0,0.5)
    // Ángulo
    this.angleInput = inputContainer.node.querySelector('input[name="angle"]')
    // Velocidad
    this.velocityInput = inputContainer.node.querySelector('input[name="velocity"]')
    // Boton fire
    this.fireButton =  inputContainer.node.querySelector('button')

    this.fireButton.addEventListener('click', () => {
      const angleVal = parseFloat(this.angleInput.value)
      const velocityVal = parseFloat(this.velocityInput.value)
      this.actualScene = this.scene.manager.getScenes()[0];
      if (angleVal != 0 && Math.abs(angleVal) < 360 && velocityVal != 0 && Math.abs(velocityVal) < 500){
          this.actualScene.player.fire(angleVal,velocityVal)
          if (!this.scene.isActive('Menu'))  this.scene.stop()
          }
    })
  }

  update(){
    if (!this.scene.manager.isActive('Interface') && this.scene.manager.getScene('Menu').autorizeTutorial == false) this.scene.stop()
  }
  
}