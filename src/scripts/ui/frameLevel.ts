import { BUTTON, FONTS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class FrameLevel extends Phaser.GameObjects.Sprite {

  private titleText: Phaser.GameObjects.Text
  private starText: Phaser.GameObjects.Text
  constructor(scene: Phaser.Scene, x: number, y: number, title: string, stars: number, onPause: () => void) {
    super(scene, x, y, 'small-frame-level')
    scene.add.existing(this)

    this.titleText = this.scene.add.text(this.x - 15, this.y - 35, title, {
      fontFamily: FONTS.ALLOY_INK,
      fontSize: '24px',
    })

    this.starText = this.scene.add.text(this.x + 15, this.y, `${stars} / 3`, {
      fontFamily: FONTS.ALLOY_INK,
      fontSize: '24px',
    })

    new ButtonSmall(scene, this.x - this.displayWidth * 0.33, this.y, {
      onClick: onPause,
      name: BUTTON.PAUSE,
      scale: {
        x: 0.35,
        y: 0.35,
      },
    })
  }
  
  public set stars(v : number) {
      this.starText.text = `${v} / 3`
  }
  
  public set title(v : string) {
      this.titleText.text = v
  }
}
