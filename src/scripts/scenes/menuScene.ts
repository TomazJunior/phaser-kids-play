import BackgroundParallax from '../ui/backgroundParallax'
import { ButtonBig } from '../ui/buttonBig'
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }
  create() {
    const { width } = this.scale  
    const background = new BackgroundParallax(this)
    new ButtonBig(this, width * 0.5, background.title.y + background.title.height, {
      text: 'START',
      onClick: () => {
        // this.scene.start('MainScene')
        this.scene.start('LevelScene')
      },
    }).setOrigin(0.5, 0.5)
  }

}
