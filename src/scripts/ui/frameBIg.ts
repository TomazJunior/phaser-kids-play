import { BUTTON, COLORS, FONTS } from '../utils/constants'
import { ButtonSmall } from './buttonSmall'

export class FrameBig<T extends Phaser.GameObjects.GameObject> extends Phaser.GameObjects.Group {
  private frame: Phaser.GameObjects.Image
  textTitle: Phaser.GameObjects.Text
  subTitleText: Phaser.GameObjects.Text
  items: Array<T> = []

  constructor(scene: Phaser.Scene, x: number, y: number, config: FrameBigInterface) {
    super(scene)
    scene.add.existing(this)
    this.setVisible(config.visible)

    this.frame = scene.add.image(x, y, 'big-frame-window')

    this.textTitle = scene.add
      .text(this.frame.x - 20, this.frame.y - this.frame.displayHeight * 0.5 + 20, config.title, {
        fontFamily: FONTS.ALLOY_INK,
        fontSize: '46px',
      })
      .setStroke(COLORS.DARK_RED, 10)
      .setOrigin(0.5, 0)

    if (config.subTitle) {
      this.subTitleText = scene.add
        .text(this.frame.x, this.frame.y - 235, config.subTitle, {
          fontFamily: FONTS.ALLOY_INK,
          fontSize: '24px',
        })
        .setStroke(COLORS.DARK_RED, 6)
        .setOrigin(0.5, 0)
      this.add(this.subTitleText)
    }

    if (config.onCloseButton) {
      const closeButton = new ButtonSmall(scene, this.frame.x + this.frame.width * 0.5 - 20, this.frame.y - 200, {
        name: BUTTON.CLOSE,
        onClick: async () => {
          if (config.onCloseButton) await config.onCloseButton()
        },
        scale: {
          x: 0.5,
          y: 0.5,
        },
      }).setOrigin(0.5, 1)
      this.addMultiple(closeButton.getChildren())
    }

    this.add(this.frame).add(this.textTitle)
  }

  addItem = (onAddItem: (x, y) => T): T => {
    const initialX = this.frame.x - this.frame.displayWidth * 0.5 + 120
    const initialY = this.frame.y - 60
    let posX = initialX
    let posY = initialY
    posX += 125 * this.items.length

    if (posX - initialX > this.frame.displayWidth - 200) {
      posX = initialX
      posY += 125
    }

    const item: T = onAddItem(posX, posY)
    this.add(item)
    this.items.push(item)
    return item
  }

  public get x(): number {
    return this.frame.x
  }

  public get y(): number {
    return this.frame.y
  }

  public get displayHeight(): number {
    return this.frame.displayHeight
  }
}
