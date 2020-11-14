import { FONTS } from '../utils/constants'

export class ButtonCircle extends Phaser.GameObjects.Group {
  private button: Phaser.GameObjects.Image
  private buttonText: Phaser.GameObjects.Text
  private _text: string

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, text: string, onClick?: () => void) {
    super(scene)
    scene.add.existing(this)
    this.button = scene.add.image(x, y, texture)
    this.buttonText = scene.add.text(x - 9, y - 15, text, {
      fontFamily: FONTS.KEN_VECTOR,
      fontSize: '28px',
    })

    this.button.setInteractive().on('pointerdown', () => {
      if (onClick) onClick()
    })
    this.add(this.button).add(this.buttonText)
  }

  public set texture(v: string) {
    this.button.setTexture(v)
  }

  public set textColor(v: string) {
    this.buttonText.setColor(v)
  }

  public set text(v: string) {
    this._text = v
    this.buttonText.text = this._text
  }
}
