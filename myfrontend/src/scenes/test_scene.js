    import Phaser from "phaser";
    import goal from '@/assets/Sprites/Instances/General/goal.webp'
    import Goal from '@/modules/goal'
    export default class TestScene extends Phaser.Scene{
    constructor(){
        super({
        key:"TestScene",
        physics: {
            arcade: {
            debug: false,
            }
        }
        });
    }

    preload(){
        this.load.image('goal', goal)
    }

    create(){
        this.cameras.main.setBackgroundColor('#222')
        this.goal = new Goal(this,300,300,'goal').spaceEvent().invertColor()
    }

    update(time){
        this.goal.update(time)
    }
}