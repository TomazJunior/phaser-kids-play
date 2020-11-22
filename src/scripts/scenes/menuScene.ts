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
    const startButton = new ButtonBig(this, width * 0.5, background.title.y + background.title.height, {
      text: {
        title: 'START',
      },
      onClick: () => {
        this.scene.start(SCENES.LEVEL_SCENE)
      },
    }).setOrigin(0.5, 0.5)
    new ButtonBig(this, width * 0.5, startButton.y + startButton.displayHeight, {
      text: {
        title: 'OPTIONS',
        fontSize: '60px',
      },
      onClick: () => {
        this.scene.start(SCENES.CONFIG_SCENE)
      },
    }).setOrigin(0.5, 0.5)
  }
}
