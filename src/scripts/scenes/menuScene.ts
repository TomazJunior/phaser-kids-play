import { Button } from '../ui/button'
import { SPRITE_NAME } from '../utils/constants'
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

    const title = this.add.bitmapText(width * 0.1, height * 0.5, 'shortStack', 'Game for kids', 82).setOrigin(0, 0)
    const button = new Button(this, width * 0.1 + title.width, height * 0.5, {
      icon: SPRITE_NAME.WHITE_SHEET,
      iconFrame: 'right.png',
      text: 'START',
      onClick: () => {
        this.scene.start('MainScene')
      },
    })
  }
}
