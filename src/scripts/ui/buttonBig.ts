import { BUTTON, FONTS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class ButtonBig extends ButtonSmall {
  constructor(scene: Phaser.Scene, x: number, y: number, config: ButtonConfig) {
    super(scene, x, y, {...config, name: BUTTON.BIG_FRAME, text: '' })
    scene.add.existing(this)
    this.setScale(0.8, 0.8)

    if (config.text) {
      this.scene.add.text(x - this.width * 0.3, y - this.height * 0.2, config.text, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '72px',
      })
    }
  }
}
