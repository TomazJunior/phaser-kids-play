import { BUTTON, FONTS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'
import RoundIndicator from './roundIndicator'

export class FrameLevel extends Phaser.GameObjects.Sprite {
  private worldText: Phaser.GameObjects.Text
  private levelText: Phaser.GameObjects.Text
  private rounds: Phaser.GameObjects.Group
  private _round: number = 0
  constructor(scene: Phaser.Scene, x: number, y: number, title: string, level: string, onPause: () => void) {
    super(scene, x, y, 'small-frame-level')
    scene.add.existing(this)

    this.worldText = this.scene.add
      .text(this.x - 25, this.y - 95, title, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '28px',
      })
      .setStroke('#901215', 10)

    this.levelText = this.scene.add
      .text(this.x - 25, this.worldText.y + this.worldText.displayHeight + 3, level, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '38px',
        color: '#ef7c7f',
      })
      .setStroke('#901215', 10)

    new ButtonSmall(scene, this.x - this.displayWidth * 0.3, this.y - this.displayHeight * 0.2, {
      onClick: onPause,
      name: BUTTON.PAUSE,
      scale: {
        x: 0.5,
        y: 0.5,
      },
    })

    this.rounds = scene.add.group()
    let offsetX = 0
    for (let index = 0; index < 5; index++) {
      this.rounds.add(new RoundIndicator(scene, this.x + offsetX, this.y + 20).setOrigin(0.5, 0))
      offsetX += 35
    }

    // TODO: calculate time
    const clockText = this.scene.add
      .text(this.x - this.displayWidth * 0.35, this.y + 20, '0:00', {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '36px',
      })
      .setStroke('#efb469', 10)
      .setOrigin(0, 0)
  }

  public set round(v: number) {
    this._round = v
    if (!this.rounds || !this.rounds.children) return

    this.rounds.getChildren().forEach((item: any, index: number) => {
      <RoundIndicator>item.changeState(index + 1 <= this._round - 1)
    })
  }

  public set worldName(v: string) {
    this.worldText.text = v
  }

  public set levelName(v: string) {
    this.levelText.text = v
  }
}
