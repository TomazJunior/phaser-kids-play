import BackgroundParallax from '../ui/backgroundParallax'
import { ButtonBig } from '../ui/buttonBig'
import { FONTS, SCENES } from '../utils/constants'
import { getDeviceId } from '../utils/fileStorage'
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU_SCENE })
  }
  create() {
    const { width, height } = this.scale
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

    this.add.text(width * 0.5, height - 30, getDeviceId(), {
      fontFamily: FONTS.KEN_VECTOR,
      fontSize: '24px',
    }).setOrigin(0.5, 0.5)
  }
}
