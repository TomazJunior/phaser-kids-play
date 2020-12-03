import { BUTTON, COLORS, FONTS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class NoInternetDialog extends Phaser.GameObjects.Sprite {
  private group: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene, x: number, y: number, onClose: () => void) {
    super(scene, x, y, 'big-frame-window')
    scene.add.existing(this)
    this.group = scene.add.group()

    const textTitle = scene.add
      .text(this.x - 20, this.y - this.displayHeight * 0.5 + 20, 'Connection Lost', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '42px',
      })
      .setStroke(COLORS.DARK_RED, 10)
      .setOrigin(0.5, 0)

    const closeButton = new ButtonSmall(scene, this.x + this.displayWidth * 0.48, this.y - this.displayHeight * 0.35, {
      name: BUTTON.CLOSE,
      onClick: () => {
        onClose()
        this.group.destroy(true)
      },
    })

    const bodyTitle = scene.add
      .text(this.x - this.displayWidth * 0.4, this.y - this.displayHeight * 0.2, 'Oops...', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '42px',
        align: 'left',
      })
      .setOrigin(0, 0)
      .setStroke(COLORS.DARK_YELLOW, 10)

    const bodyText = scene.add
      .text(
        this.x - this.displayWidth * 0.4,
        this.y - this.displayHeight * 0.1,
        ['Please check your internet', 'connection and try again'],
        {
          fontFamily: FONTS.KEN_VECTOR,
          fontSize: '28px',
        }
      )
      .setOrigin(0, 0)
      .setStroke(COLORS.DARK_YELLOW, 10)

    this.group.add(this).add(textTitle).addMultiple(closeButton.getChildren()).add(bodyTitle).add(bodyText)
  }
}
