import { BUTTON, COLORS, FONTS } from '../utils/constants'
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
      .setStroke(COLORS.DARK_RED, 10)
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
      .setStroke(COLORS.DARK_YELLOW, 10)

    const creditsText = scene.add
      .text(
        this.x - 10,
        this.y - this.displayHeight * 0.1,
        [
          'https://opengameart.org/users/jellyfizh',
          'https://kenney.nl',
          'https://www.gameart2d.com',
          'https://www.dafont.com/a-alloy-ink.font',
          '',
          'Sound Effects',
          'https://freemusicarchive.org/music/Rolemusic',
        ],
        {
          fontFamily: FONTS.KEN_VECTOR,
          fontSize: '20px',
        }
      )
      .setOrigin(0.5, 0)
      .setStroke(COLORS.DARK_YELLOW, 10)

    const versionText = scene.add
      .text(this.x + this.displayWidth * 0.35, this.y + this.displayHeight * 0.35, 'v.0.5', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '32px',
      })
      .setOrigin(0.5, 0)
      .setStroke(COLORS.DARK_YELLOW, 10)

    this.group
      .add(this)
      .add(textTitle)
      .addMultiple(closeButton.getChildren())
      .add(creditsTitle)
      .add(creditsText)
      .add(versionText)
  }
}
