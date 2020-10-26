import BackgroundParallax from '../ui/backgroundParallax'
import { ButtonBig } from '../ui/buttonBig'
import { SCENES } from '../utils/constants'
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU_SCENE })
  }
  create() {
    const { width } = this.scale
    const background = new BackgroundParallax(this)
    new ButtonBig(this, width * 0.5, background.title.y + background.title.height, {
      text: {
        title: 'START',
      },
      onClick: () => {
        // this.scene.start(SCENES.MAIN_SCENE)
        this.scene.start(SCENES.LEVEL_SCENE)
      },
    }).setOrigin(0.5, 0.5)
  }
}
