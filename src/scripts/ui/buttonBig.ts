import { BUTTON, FONTS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class ButtonBig extends ButtonSmall {
  constructor(scene: Phaser.Scene, x: number, y: number, config: ButtonConfig) {
    super(scene, x, y, {
      ...config,
      name: BUTTON.BIG_FRAME,
      text: {
        ...config.text,
        title: '',
      },
    })
    scene.add.existing(this)
    if (config.scale) {
      this.button.setScale(config.scale.x, config.scale.y)
    } else {
      this.button.setScale(0.8, 0.8)
    }

    if (config.text?.title) {
      const paddingX = config.text.padding?.x || 0
      const paddingY = config.text.padding?.y || 0
      const text = this.scene.add.text(x - this.button.width * 0.3 + paddingX, y - this.button.height * 0.3 + paddingY, config.text.title, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: config.text.fontSize || '72px',
      })
      if (config.text.stroke) {
        const {color, thickness} = config.text.stroke
        text.setStroke(color, thickness)
      } else {
        text.setStroke('#04ccff', 20)
      }
      this.add(text)
    }
  }
}
