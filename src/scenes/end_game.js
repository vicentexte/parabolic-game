import input_score from "@/html/input_score.html"
import dom_bg from '@/assets/sprites/interface/dom_bg.webp'
import send_button from '@/assets/sprites/interface/send_button.webp'
import name_label from '@/assets/sprites/interface/name_label.webp'
import score_label from '@/assets/sprites/interface/score_label.webp'

import click_sfx from '@/assets/sounds/sfx/click.ogg'

import Phaser from "phaser";
export default class EndGame extends Phaser.Scene {
  constructor(){
    super({
      key:"EndGame",
      physics: {
        arcade: {
          debug: false,
        }
      }
    })
  }

  preload(){
    this.load.audio('click_sfx', click_sfx)
  }

  create(){
    const click = this.sound.add('click_sfx')
    const score = this.scene.get('Interface').score
    this.scene.get('Interface').scene.stop()
    const dom = this.add.dom(this.scale.width/2, this.scale.height/2).createFromHTML(input_score
      .replace('{{dom_bg}}',dom_bg)
      .replace('{{send_button}}',send_button)
      .replace('{{name_label}}',name_label)
      .replace('{{score_label}}',score_label)
      .replace('{{score}}', score)
    )

    const send = dom.node.querySelector('button')

    send.addEventListener('click', () => {
      click.play()
      this.scene.start('Menu')
    })
  }

  update(){

  }


}