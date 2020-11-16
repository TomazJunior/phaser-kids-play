import { COLORS, FONTS } from '../utils/constants'
import { getGems, incPlayerGems } from '../utils/fileStorage'
import { ButtonCircle } from './buttonCircle'

export class GemScore extends Phaser.GameObjects.Group {
  private _value: number
  private frame: Phaser.GameObjects.Sprite
  private addButton: ButtonCircle
  private valueText: Phaser.GameObjects.Text
  y: number

  constructor(scene: Phaser.Scene, private x: number) {
    super(scene)
    scene.add.existing(this)

    this.y = -100
    this.frame = scene.add.sprite(x, this.y, 'gem-score')
    this._value = getGems()

    this.valueText = scene.add
      .text(this.x - 20, this.y, this._value.toString(), {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '46px',
      })
      .setStroke(COLORS.DARK_YELLOW, 10)
      .setOrigin(0.5, 0.5)

    this.addButton = new ButtonCircle(
      scene,
      this.x + 120,
      this.y + 30,
      'circle-blue',
      '+',
      this.handleAddClick
    ).setVisible(false)

    this.add(this.frame).add(this.valueText).addMultiple(this.addButton.getChildren())
  }

  private get value(): number {
    return this._value
  }

  private set value(v: number) {
    this._value = v
    this.valueText.text = v.toString()
  }

  async show() {
    this.value = getGems()
    return new Promise((resolve) => {
      this.setVisible(true)
      this.scene.tweens.add({
        targets: this.getChildren(),
        duration: 500,
        y: '+=160',
        onComplete: () => {
          resolve()
        },
      })
    })
  }

  hide() {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.getChildren(),
        duration: 500,
        y: '-=160',
        onComplete: () => {
          this.setVisible(false)
          resolve()
        },
      })
    })
  }

  refreshValue = (): Promise<void> => {
    return new Promise((resolve) => {
      const currentValue = this._value
      const updatedValue = getGems()

      this.scene.tweens.addCounter({
        from: currentValue,
        to: updatedValue,
        duration: 500,
        onUpdate: (tween: Phaser.Tweens.Tween, { value }: any) => {
          this.value = Math.trunc(value)
        },
        onComplete: () => {
          this.value = updatedValue
          resolve()
        },
      })
    })
  }

  incValue = (value: number) => {
    incPlayerGems(value)
    this.value = getGems()
  }

  handleAddClick = () => {
    //TODO: implement buy gem
    // needs to integrate with server side + android
  }

  showAddButton = (visible: boolean) => {
    this.addButton.setVisible(visible)
  }
}
