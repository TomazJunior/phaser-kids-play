import { BUTTON, FONTS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class ButtonBig extends ButtonSmall {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void) {
    super(scene, x, y, BUTTON.BIG_FRAME, onClick)
    scene.add.existing(this)
    this.setScale(0.8, 0.8)

    this.scene.add.text(x - this.width * 0.3, y - this.height * 0.2, text, {
      fontFamily: FONTS.ALLOY_INK,
      fontSize: '72px',
    })
  }
}
