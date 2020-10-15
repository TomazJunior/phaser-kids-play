import { FONTS, SCORE_PER_HIDDEN_CHAR } from '../utils/constants'

export default class ScoreText extends Phaser.GameObjects.BitmapText {
  private _score: integer

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, FONTS.PIXEL_FONT, '', 48)
    scene.add.existing(this)
    this.setTint(0x00000)
    this.score = 0
  }

  public set score(v: integer) {
    this._score = v
    this.setScoreFormated()
  }

  public get score(): integer {
    return this._score
  }

  public incScore() {
    this.score += SCORE_PER_HIDDEN_CHAR
  }

  private setScoreFormated() {
    this.text = this._score.toString().padStart(6, '0')
  }
}
