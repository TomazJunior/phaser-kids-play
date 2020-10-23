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
      this.setScale(config.scale.x, config.scale.y)
    } else {
      this.setScale(0.8, 0.8)
    }

    if (config.text?.title) {
      const paddingX = config.text.padding?.x || 0
      const paddingY = config.text.padding?.y || 0
      this.scene.add.text(x - this.width * 0.3 + paddingX, y - this.height * 0.2 + paddingY, config.text.title, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: config.text.fontSize || '72px',
      })
    }
  }
}
