import { BUTTON, FONTS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class InfoDialog extends Phaser.GameObjects.Sprite {
  private group: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'big-frame-window')
    scene.add.existing(this)
    this.group = scene.add.group()

    const textTitle = scene.add
      .text(this.x - 20, this.y - this.displayHeight * 0.5 + 20, 'info', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '58px',
      })
      .setOrigin(0.5, 0)

    const closeButton = new ButtonSmall(scene, this.x + this.displayWidth * 0.48, this.y - this.displayHeight * 0.35, {
      name: BUTTON.CLOSE,
      onClick: () => {
        this.group.destroy(true)
      },
    })

    const creditsTitle = scene.add
      .text(this.x - 20, this.y - this.displayHeight * 0.23, 'Credits', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '42px',
      })
      .setOrigin(0.5, 0)
    creditsTitle.setShadow(3, 3, 'rgba(0,0,0)', 5)

    const versionText = scene.add
      .text(this.x + this.displayWidth * 0.35, this.y + this.displayHeight * 0.35, 'v.0.1', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '32px',
        color: 'gray',
      })
      .setOrigin(0.5, 0)

    this.group.add(this).add(textTitle).add(closeButton).add(creditsTitle).add(versionText)
  }
}
