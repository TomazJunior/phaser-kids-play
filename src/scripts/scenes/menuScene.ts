import { ButtonBig } from '../ui/buttonBig'
import { FONTS } from '../utils/constants'
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }
  create() {
    const { width, height } = this.scale
    const background = this.add.image(width * 0.5, height * 0.5, 'background')
    let scaleX = width / background.width
    let scaleY = height / background.height
    let scale = Math.max(scaleX, scaleY)
    background.setScale(scale).setScrollFactor(0)

    const title = this.add
      .bitmapText(width * 0.5, height * 0.3, FONTS.SHORT_STACK, 'Game for kids', 150)
      .setOrigin(0.5, 0.5)

    new ButtonBig(this, width * 0.5, title.y + title.height, {
      text: 'START',
      onClick: () => {
        // this.scene.start('MainScene')
        this.scene.start('LevelScene')
      },
    }).setOrigin(0.5, 0.5)
  }
}
